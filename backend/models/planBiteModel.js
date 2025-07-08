import db from '../config/db.js';

class PlanBite {
    // Fetch all available bite menu items (e.g., Chicken, Pork, etc.)
    // In getBiteMenuItems method
    static async getBiteMenuItems() {
        const connection = await db.getConnection();
        try {
            const [menuItems] = await connection.query(
                `SELECT menu_type_id, menu_type_name, CAST(price AS DECIMAL(10,2)) AS price 
             FROM menu_type 
             WHERE menu_list_type_id = 'MLT000005'`
            );
            connection.release();
            return menuItems;
        } catch (error) {
            connection.release();
            console.error("Database Error:", error);
            throw new Error("Failed to fetch menu items");
        }
    }

    // Store selected bite items and calculate total price
   static async PlanBiteMenu(booking_id, biteItems) {
    const connection = await db.getConnection();
    try {
        await connection.query('START TRANSACTION');

        // Get Event and BarRequirementID (create if missing)
        const [event] = await connection.query(
            `SELECT Event_ID, BarRequirementID FROM Event WHERE booking_id = ?`,
            [booking_id]
        );
        if (!event.length) throw new Error('Event not found');

        let { Event_ID, BarRequirementID } = event[0];
        let bite_ID; // Declare here to use throughout

        // Create Bar entry if not exists
        if (!BarRequirementID) {
            const [lastBar] = await connection.query(
                `SELECT BarRequirementID FROM Bar ORDER BY BarRequirementID DESC LIMIT 1`
            );
            let newIdNumber = lastBar.length ?
                parseInt(lastBar[0].BarRequirementID.replace('BAR', '')) + 1 : 1;
            BarRequirementID = `BAR${String(newIdNumber).padStart(6, '0')}`;

            await connection.query(
                `INSERT INTO Bar (BarRequirementID) VALUES (?)`,
                [BarRequirementID]
            );

            await connection.query(
                `UPDATE Event SET BarRequirementID = ? WHERE Event_ID = ?`,
                [BarRequirementID, Event_ID]
            );
        }

        // Generate ONE Bite_ID for the entire order
        const [lastBite] = await connection.query(
            `SELECT Bite_ID FROM Bite ORDER BY Bite_ID DESC LIMIT 1`
        );
        let biteIdNumber = lastBite.length ?
            parseInt(lastBite[0].Bite_ID.replace('BITE', '')) + 1 : 1;
        bite_ID = `BITE${String(biteIdNumber).padStart(6, '0')}`;

        // Insert selected bite items with SAME Bite_ID
        for (const item of biteItems) {
            await connection.query(
                `INSERT INTO Bite 
                 (Bite_ID, Quantity, BarRequirementID, menu_type_id)
                 VALUES (?, ?, ?, ?)`,
                [bite_ID, item.Quantity, BarRequirementID, item.menu_type_id]
            );
        }

        // Calculate total price
        const [totalResult] = await connection.query(
            `SELECT SUM(b.Quantity * mt.price) AS total
             FROM Bite b
             JOIN menu_type mt ON b.menu_type_id = mt.menu_type_id
             WHERE b.BarRequirementID = ?`,
            [BarRequirementID]
        );
        const totalPrice = totalResult[0].total || 0;

        await connection.query(
            `UPDATE Bar 
             SET TotalBitePrice = ?
             WHERE BarRequirementID = ?`,
            [totalPrice, BarRequirementID]
        );

        await connection.query('COMMIT');
        connection.release();

        return { totalPrice, bite_ID };

    } catch (error) {
        await connection.query('ROLLBACK');
        connection.release();
        console.error("Database Error (PlanBiteMenu):", error.message || error);
        throw new Error(error.message || "Failed to save Bite menu");
    }
}

    // Fetch stored selections and total price for a booking
    static async getBiteMenu(booking_id) {
    const connection = await db.getConnection();
    try {
        const [event] = await connection.query(
            `SELECT BarRequirementID FROM Event WHERE booking_id = ?`,
            [booking_id]
        );

        if (!event.length || !event[0].BarRequirementID) {
            return { biteItems: [], totalPrice: 0 };
        }
        const BarRequirementID = event[0].BarRequirementID;

        const [biteItems] = await connection.query(
            `SELECT b.Bite_ID, b.Quantity, mt.menu_type_id, mt.menu_type_name, mt.price 
             FROM Bite b
             JOIN menu_type mt ON b.menu_type_id = mt.menu_type_id
             WHERE b.BarRequirementID = ?`,
            [BarRequirementID]
        );

        const [totalResult] = await connection.query(
            `SELECT SUM(b.Quantity * mt.price) AS total
             FROM Bite b
             JOIN menu_type mt ON b.menu_type_id = mt.menu_type_id
             WHERE b.BarRequirementID = ?`,
            [BarRequirementID]
        );

        connection.release();
        return {
            biteItems: biteItems.map(item => ({
                ...item,
                Quantity: Number(item.Quantity),
                price: Number(item.price)
            })),
            totalPrice: Number(totalResult[0].total) || 0
        };

    } catch (error) {
        connection.release();
        throw new Error("Failed to fetch Bite menu");
    }
}

   static async UpdateBiteMenu(booking_id, biteItems) {
    const connection = await db.getConnection();
    try {
        await connection.query('START TRANSACTION');

        // Get existing BarRequirementID from Event
        const [event] = await connection.query(
            `SELECT Event_ID, BarRequirementID FROM Event WHERE booking_id = ?`,
            [booking_id]
        );
        if (!event.length || !event[0].BarRequirementID) {
            throw new Error('No existing Bite plan found for this booking');
        }
        const barRequirementID = event[0].BarRequirementID;

        // Get existing Bite_ID for this bar requirement
        const [existingBite] = await connection.query(
            `SELECT Bite_ID FROM Bite WHERE BarRequirementID = ? LIMIT 1`,
            [barRequirementID]
        );
        
        let bite_ID;
        if (existingBite.length) {
            // Use existing Bite_ID
            bite_ID = existingBite[0].Bite_ID;
        } else {
            // Generate new Bite_ID if none exists
            const [lastBite] = await connection.query(
                `SELECT Bite_ID FROM Bite ORDER BY Bite_ID DESC LIMIT 1`
            );
            let biteIdNumber = lastBite.length ?
                parseInt(lastBite[0].Bite_ID.replace('BITE', '')) + 1 : 1;
            bite_ID = `BITE${String(biteIdNumber).padStart(6, '0')}`;
        }

        // Delete existing Bite entries
        await connection.query(
            `DELETE FROM Bite WHERE BarRequirementID = ?`,
            [barRequirementID]
        );

        // Insert new Bite items with SAME Bite_ID
        for (const item of biteItems) {
            await connection.query(
                `INSERT INTO Bite 
                 (Bite_ID, Quantity, BarRequirementID, menu_type_id)
                 VALUES (?, ?, ?, ?)`,
                [bite_ID, item.Quantity, barRequirementID, item.menu_type_id]
            );
        }

        // Calculate total price
        const [totalResult] = await connection.query(
            `SELECT SUM(b.Quantity * mt.price) AS total
             FROM Bite b
             JOIN menu_type mt ON b.menu_type_id = mt.menu_type_id
             WHERE b.BarRequirementID = ?`,
            [barRequirementID]
        );
        const totalPrice = totalResult[0].total || 0;

        // Update Bar with new total price
        await connection.query(
            `UPDATE Bar 
             SET TotalBitePrice = ?
             WHERE BarRequirementID = ?`,
            [totalPrice, barRequirementID]
        );

        await connection.query('COMMIT');
        connection.release();

        return { totalPrice };

    } catch (error) {
        await connection.query('ROLLBACK');
        connection.release();
        console.error("Database Error (UpdateBiteMenu):", error.message || error);
        throw new Error(error.message || "Failed to update Bite menu");
    }
}
    static async deleteBiteMenu(booking_id) {
        const connection = await db.getConnection();
        try {
            await connection.query('START TRANSACTION');

            // Get BarRequirementID from Event
            const [event] = await connection.query(
                `SELECT Event_ID, BarRequirementID FROM Event WHERE booking_id = ?`,
                [booking_id]
            );
            if (!event.length || !event[0].BarRequirementID) {
                throw new Error('No existing Bite plan found for this booking');
            }
            const barRequirementID = event[0].BarRequirementID;

            // Delete Bite entries
            await connection.query(
                `DELETE FROM Bite WHERE BarRequirementID = ?`,
                [barRequirementID]
            );

            // Delete Bar entry
            await connection.query(
                `UPDATE Bar SET TotalBitePrice = NULL WHERE BarRequirementID = ?`,
                [barRequirementID]
            );

            // Update Event to remove BarRequirementID
            // await connection.query(
            //     `UPDATE Event SET BarRequirementID = NULL WHERE Event_ID = ?`,
            //     [event[0].Event_ID]
            // );

            await connection.query('COMMIT');
            connection.release();

            return true;
        } catch (error) {
            await connection.query('ROLLBACK');
            connection.release();
            console.error("Database Error (deleteBiteMenu):", error.message || error);
            throw new Error(error.message || "Failed to delete Bite menu");
        }
    }

}

export default PlanBite;