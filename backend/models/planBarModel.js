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
            console.error("Database Error (createPlanBar):", error.message || error);
            throw new Error(error.message || "Failed to create Plan Bar event.");
        }
    }
}
export default PlanBar;