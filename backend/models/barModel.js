import db from '../config/db.js';

class BarManager {
    static async getBarRequirementID(booking_id) {
        const connection = await db.getConnection();
        try {
            const [event] = await connection.query(
                `SELECT BarRequirementID FROM Event 
                 WHERE booking_id = ?`,
                [booking_id]
            );
            return event[0]?.BarRequirementID;
        } finally {
            connection.release();
        }
    }

    static async getBarDetails(booking_id) {
        const connection = await db.getConnection();
        try {
            // Get BarRequirementID from Event
            const [event] = await connection.query(
                `SELECT BarRequirementID FROM Event 
             WHERE booking_id = ?`,
                [booking_id]
            );

            if (!event.length || !event[0].BarRequirementID) {
                return {
                    barDetails: null,
                    liquorItems: [],
                    softDrinkItems: []
                };
            }

            const barRequirementID = event[0].BarRequirementID;

            // Get bar main details
            const [barDetails] = await connection.query(
                `SELECT * FROM Bar 
             WHERE BarRequirementID = ?`,
                [barRequirementID]
            );

            // Get liquor items
            const [liquorItems] = await connection.query(
                `SELECT 
                Liquor_ID AS id,
                item_name AS name,
                quantity,
                usages,
                LiquorPrice AS price
             FROM liquor_items
             WHERE BarRequirementID = ?`,
                [barRequirementID]
            );

            // Get soft drink items
            const [softDrinkItems] = await connection.query(
                `SELECT 
                Soft_Drink_id AS id,
                Soft_Drink_name AS name,
                quantity,
                usages,
                DrinkPrice AS price
             FROM soft_drink_items
             WHERE BarRequirementID = ?`,
                [barRequirementID]
            );

            return {
                barDetails: {
                    ...barDetails[0],
                    TotalBitePrice: Number(barDetails[0].TotalBitePrice),
                    TotalLiquorPrice: Number(barDetails[0].TotalLiquorPrice),
                    TotalSoftDrinkPrice: Number(barDetails[0].TotalSoftDrinkPrice)
                },
                liquorItems: liquorItems.map(item => ({
                    ...item,
                    quantity: Number(item.quantity),
                    price: Number(item.price)
                })),
                softDrinkItems: softDrinkItems.map(item => ({
                    ...item,
                    quantity: Number(item.quantity),
                    price: Number(item.price)
                }))
            };

        } catch (error) {
            console.error("Database Error (getBarDetails):", error);
            throw new Error("Failed to fetch bar details");
        } finally {
            connection.release();
        }
    }

    static async updateBarTotals(barRequirementID) {
        const connection = await db.getConnection();
        try {
            // Update Liquor Total
            const [liquorTotal] = await connection.query(
                `SELECT SUM(quantity * LiquorPrice) AS total 
                 FROM liquor_items 
                 WHERE BarRequirementID = ?`,
                [barRequirementID]
            );

            // Update Soft Drink Total
            const [softDrinkTotal] = await connection.query(
                `SELECT SUM(quantity * DrinkPrice) AS total 
                 FROM soft_drink_items 
                 WHERE BarRequirementID = ?`,
                [barRequirementID]
            );

            await connection.query(
                `UPDATE Bar SET 
                 TotalLiquorPrice = ?,
                 TotalSoftDrinkPrice = ?
                 WHERE BarRequirementID = ?`,
                [
                    liquorTotal[0].total || 0,
                    softDrinkTotal[0].total || 0,
                    barRequirementID
                ]
            );
        } finally {
            connection.release();
        }
    }
}

class LiquorItem {
    static async addItem(booking_id, itemData) {
        const connection = await db.getConnection();
        try {
            await connection.query('START TRANSACTION');

            const barRequirementID = await BarManager.getBarRequirementID(booking_id);
            if (!barRequirementID) throw new Error('No bar plan exists for this booking');

            const [result] = await connection.query(
                `INSERT INTO liquor_items 
                (Liquor_ID, item_name, quantity, usages, BarRequirementID, LiquorPrice)
                VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    `LIQ${String(await this.getNextId()).padStart(7, '0')}`,
                    itemData.itemName,
                    itemData.quantity,
                    itemData.usages || '0',
                    barRequirementID,
                    itemData.price
                ]
            );
            console.log(itemData.itemName);
            console.log(itemData.quantity);
            console.log(itemData.usages);
            console.log(itemData.price);
            console.log(barRequirementID);

            const [liquorTotal] = await connection.query(
                `SELECT SUM(quantity * LiquorPrice) AS total 
                 FROM liquor_items 
                 WHERE BarRequirementID = ?`,
                [barRequirementID]
            );

            await connection.query(
                `UPDATE Bar SET 
                 TotalLiquorPrice = ?
                 WHERE BarRequirementID = ?`,
                [
                    liquorTotal[0].total || 0,
                    barRequirementID
                ]
            );

            // await BarManager.updateBarTotals(barRequirementID);
            await connection.query('COMMIT');
            return result.insertId;
        } catch (error) {
            await connection.query('ROLLBACK');
            throw error;
        } finally {
            connection.release();
        }
    }

    static async getNextId() {
        const connection = await db.getConnection();
        try {
            const [rows] = await connection.query(
                `SELECT MAX(Liquor_ID) AS maxId FROM liquor_items`
            );
            return rows[0].maxId ? parseInt(rows[0].maxId.replace('LIQ', '')) + 1 : 1;
        } finally {
            connection.release();
        }
    }

    static async updateItem(booking_id, itemId, updateData) {
        const connection = await db.getConnection();
        try {
            await connection.query('START TRANSACTION');

            const barRequirementID = await BarManager.getBarRequirementID(booking_id);
            if (!barRequirementID) throw new Error('No bar plan exists for this booking');

            // Update item
            await connection.query(
                `UPDATE liquor_items SET
             item_name = ?,
             quantity = ?,
             usages = ?,
             LiquorPrice = ?
             WHERE Liquor_ID = ? AND BarRequirementID = ?`,
                [
                    updateData.itemName,
                    updateData.quantity,
                    updateData.usages || '0',
                    updateData.price,
                    itemId,
                    barRequirementID
                ]
            );

            const [liquorTotal] = await connection.query(
                `SELECT SUM(quantity * LiquorPrice) AS total 
                 FROM liquor_items 
                 WHERE BarRequirementID = ?`,
                [barRequirementID]
            );

            await connection.query(
                `UPDATE Bar SET 
                 TotalLiquorPrice = ?
                 WHERE BarRequirementID = ?`,
                [
                    liquorTotal[0].total || 0,
                    barRequirementID
                ]
            );

            //await BarManager.updateBarTotals(barRequirementID);
            await connection.query('COMMIT');
            return true;
        } catch (error) {
            await connection.query('ROLLBACK');
            throw error;
        } finally {
            connection.release();
        }
    }

    static async deleteItem(booking_id, item_id) {
        const connection = await db.getConnection();
        try {
            await connection.query('START TRANSACTION');
            const barRequirementID = await BarManager.getBarRequirementID(booking_id);
            if (!barRequirementID) throw new Error('No bar plan exists for this booking');



            await connection.query(
                `DELETE FROM liquor_items 
                 WHERE Liquor_ID = ? AND BarRequirementID = ?`,
                [item_id, barRequirementID]
            );

            const [liquorTotal] = await connection.query(
                `SELECT SUM(quantity * LiquorPrice) AS total 
                 FROM liquor_items 
                 WHERE BarRequirementID = ?`,
                [barRequirementID]
            );

            await connection.query(
                `UPDATE Bar SET 
                 TotalLiquorPrice = ?
                 WHERE BarRequirementID = ?`,
                [
                    liquorTotal[0].total || 0,
                    barRequirementID
                ]
            );


            // await BarManager.updateBarTotals(barRequirementID);
            await connection.query('COMMIT');
            return true;
        } catch (error) {
            await connection.query('ROLLBACK');
            throw error;
        } finally {
            connection.release();
        }
    }
}

class SoftDrinkItem {
    static async addItem(booking_id, itemData) {
        const connection = await db.getConnection();
        try {
            await connection.query('START TRANSACTION');

            const barRequirementID = await BarManager.getBarRequirementID(booking_id);
            if (!barRequirementID) throw new Error('No bar plan exists for this booking');

            const [result] = await connection.query(
                `INSERT INTO soft_drink_items 
                (Soft_Drink_id, Soft_Drink_name, quantity, usages, BarRequirementID, DrinkPrice)
                VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    `SFT${String(await this.getNextId()).padStart(7, '0')}`,
                    itemData.itemName,
                    itemData.quantity,
                    itemData.usages || '0',
                    barRequirementID,
                    itemData.price
                ]
            );

            console.log(itemData.itemName);
            console.log(itemData.quantity);
            console.log(itemData.usages);
            console.log(itemData.price);
            console.log(barRequirementID);

            const [softDrinkTotal] = await connection.query(
                `SELECT SUM(quantity * DrinkPrice) AS total 
                 FROM soft_drink_items 
                 WHERE BarRequirementID = ?`,
                [barRequirementID]
            );

            await connection.query(
                `UPDATE Bar SET 
                 TotalSoftDrinkPrice = ?
                 WHERE BarRequirementID = ?`,
                [
                    softDrinkTotal[0].total || 0,
                    barRequirementID
                ]
            );

            //await BarManager.updateBarTotals(barRequirementID);
            await connection.query('COMMIT');
            return result.insertId;
        } catch (error) {
            await connection.query('ROLLBACK');
            throw error;
        } finally {
            connection.release();
        }
    }

    static async getNextId() {
        const connection = await db.getConnection();
        try {
            const [rows] = await connection.query(
                `SELECT MAX(Soft_Drink_id) AS maxId FROM soft_drink_items`
            );
            return rows[0].maxId ? parseInt(rows[0].maxId.replace('SFT', '')) + 1 : 1;
        } finally {
            connection.release();
        }
    }

    static async updateItem(booking_id, itemId, updateData) {
        const connection = await db.getConnection();
        try {
            await connection.query('START TRANSACTION');

            const barRequirementID = await BarManager.getBarRequirementID(booking_id);
            if (!barRequirementID) throw new Error('No bar plan exists for this booking');

            await connection.query(
                `UPDATE soft_drink_items SET
             Soft_Drink_name = ?,
             quantity = ?,
             usages = ?,
             DrinkPrice = ?
             WHERE Soft_Drink_id = ? AND BarRequirementID = ?`,
                [
                    updateData.itemName,
                    updateData.quantity,
                    updateData.usages || '0',
                    updateData.price,
                    itemId,
                    barRequirementID
                ]
            );

            const [softDrinkTotal] = await connection.query(
                `SELECT SUM(quantity * DrinkPrice) AS total 
                 FROM soft_drink_items 
                 WHERE BarRequirementID = ?`,
                [barRequirementID]
            );

            await connection.query(
                `UPDATE Bar SET 
                 TotalSoftDrinkPrice = ?
                 WHERE BarRequirementID = ?`,
                [
                    liquorTotal[0].total || 0,
                    softDrinkTotal[0].total || 0,
                    barRequirementID
                ]
            );

            // await BarManager.updateBarTotals(barRequirementID);
            await connection.query('COMMIT');
            return true;
        } catch (error) {
            await connection.query('ROLLBACK');
            throw error;
        } finally {
            connection.release();
        }
    }

    static async deleteItem(booking_id, itemId) {
        const connection = await db.getConnection();
        try {
            await connection.query('START TRANSACTION');
            const barRequirementID = await BarManager.getBarRequirementID(booking_id);
            if (!barRequirementID) throw new Error('No bar plan exists for this booking');

            await connection.query(
                `DELETE FROM soft_drink_items 
                 WHERE Soft_Drink_id = ? AND BarRequirementID = ?`,
                [itemId, barRequirementID]
            );

            const [softDrinkTotal] = await connection.query(
                `SELECT SUM(quantity * DrinkPrice) AS total 
                 FROM soft_drink_items 
                 WHERE BarRequirementID = ?`,
                [barRequirementID]
            );

            await connection.query(
                `UPDATE Bar SET 
                 TotalSoftDrinkPrice = ?
                 WHERE BarRequirementID = ?`,
                [
                    softDrinkTotal[0].total || 0,
                    barRequirementID
                ]
            );

            //await BarManager.updateBarTotals(barRequirementID);
            await connection.query('COMMIT');
            return true;
        } catch (error) {
            await connection.query('ROLLBACK');
            throw error;
        } finally {
            connection.release();
        }
    }

}

export { LiquorItem, SoftDrinkItem, BarManager };