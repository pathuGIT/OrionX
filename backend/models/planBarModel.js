import db from '../config/db.js';

class PlanBar {
    static async createPlanBar(booking_id, planBarData) {
        const connection = await db.getConnection();
        try {
            await connection.query('START TRANSACTION');
            // Insert into Event table and retrieve Event_ID
            const [event] = await connection.query(
                `SELECT Event_ID FROM Event WHERE booking_id = ?`,
                [booking_id]
            );
            const newEventID = event[0].Event_ID;

            const [lastId] = await connection.query(
                `SELECT BarRequirementID FROM Bar 
                     ORDER BY BarRequirementID DESC LIMIT 1`
            );

            let newIdNumber = lastId.length ?
                parseInt(lastId[0].BarRequirementID.replace('BAR', '')) + 1 : 1;
            let barRequirement_ID = `BAR${String(newIdNumber).padStart(6, '0')}`;

            // Insert into PlanBar table using the correct Event_ID
            await db.query(
                `INSERT INTO Bar 
                (BarRequirementID, LiquorTimeFrom, LiquorTimeTo, BarPax) 
                VALUES (?, ?, ?, ?)`,
                [
                    barRequirement_ID,
                    planBarData.LiquorTimeFrom,
                    planBarData.LiquorTimeTo,
                    planBarData.BarPax
                ]
            );

            await connection.query(
                    `UPDATE event
                    SET BarRequirementID = ?
                    WHERE Event_ID = ?`,
                    [
                        barRequirement_ID
                        , newEventID
                    ]
                );
            await connection.query('COMMIT');
            connection.release();

            console.log("Plan Bar inserted successfully with Event_ID:", newEventID);
            return newEventID;
        } catch (error) {
            await connection.query('ROLLBACK');
            connection.release();
            console.error("Database Error (createPlanBar):", error.message || error);
            throw new Error(error.message || "Failed to create Plan Bar");
        }
    }

    static async updatePlanBar(booking_id, planBarData) {
        const connection = await db.getConnection();
        try {
            await connection.query('START TRANSACTION');

            // Get existing event and bar requirement
            const [event] = await connection.query(
                `SELECT Event_ID, BarRequirementID FROM Event 
                 WHERE booking_id = ?`,
                [booking_id]
            );

            if (!event.length || !event[0].BarRequirementID) {
                throw new Error('No existing bar plan found for this booking');
            }

            // Update bar requirements
            await connection.query(
                `UPDATE Bar SET
                    LiquorTimeFrom = ?,
                    LiquorTimeTo = ?,
                    BarPax = ?
                 WHERE BarRequirementID = ?`,
                [
                    planBarData.LiquorTimeFrom,
                    planBarData.LiquorTimeTo,
                    planBarData.BarPax,
                    event[0].BarRequirementID
                ]
            );

            await connection.query('COMMIT');
            connection.release();
            
            console.log("Plan Bar updated successfully");
            return event[0].Event_ID;

        } catch (error) {
            await connection.query('ROLLBACK');
            connection.release();
            console.error("Database Error (updatePlanBar):", error.message || error);
            throw new Error(error.message || "Failed to update Plan Bar");
        }
    }

    static async deletePlanBar(booking_id) {
        const connection = await db.getConnection();
        try {
            await connection.query('START TRANSACTION');

            // Get existing bar requirement
            const [event] = await connection.query(
                `SELECT Event_ID, BarRequirementID FROM Event 
                 WHERE booking_id = ?`,
                [booking_id]
            );

            if (!event.length || !event[0].BarRequirementID) {
                throw new Error('No existing bar plan found for this booking');
            }

            // Remove bar requirement reference from event
            await connection.query(
                `UPDATE Event SET BarRequirementID = NULL 
                 WHERE Event_ID = ?`,
                [event[0].Event_ID]
            );

            // Delete from bar table
            await connection.query(
                `DELETE FROM Bar 
                 WHERE BarRequirementID = ?`,
                [event[0].BarRequirementID]
            );

            await connection.query('COMMIT');
            connection.release();
            
            console.log("Plan Bar deleted successfully");
            return true;

        } catch (error) {
            await connection.query('ROLLBACK');
            connection.release();
            console.error("Database Error (deletePlanBar):", error.message || error);
            throw new Error(error.message || "Failed to delete Plan Bar");
        }
    }

    static async getPlanBar(booking_id) {
        const connection = await db.getConnection();
        try {
            const [result] = await connection.query(
                `SELECT b.* FROM Bar b
                 JOIN Event e ON b.BarRequirementID = e.BarRequirementID
                 WHERE e.booking_id = ?`,
                [booking_id]
            );

            connection.release();
            return result.length ? result[0] : null;

        } catch (error) {
            connection.release();
            console.error("Database Error (getPlanBar):", error.message || error);
            throw new Error(error.message || "Failed to fetch Plan Bar");
        }
    }
}

export default PlanBar;