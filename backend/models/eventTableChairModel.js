import db from '../config/db.js';

export class EventLinkModel {
    static async linkArrangement(eventId, arrangementId) {
        let connection;
        try {
            connection = await db.getConnection();
            await connection.query('START TRANSACTION');

            // Link arrangement to event
            await connection.query(
                `INSERT INTO event_table_chair (Event_ID, Arrangement_Id)
                VALUES (?, ?)`,
                [eventId, arrangementId]
            );


            await connection.query('COMMIT');
            return true;
        } catch (error) {
            await connection.query('ROLLBACK');
            console.error("Database Error (linkArrangement):", error.message);
            throw new Error(error.message || "Failed to link arrangement to event");
        } finally {
            if (connection) connection.release();
        }
    }

    static async getArrangementsByBooking(bookingId) {
        try {
            const [arrangements] = await db.query(
                `SELECT etc.*, tca.*, tr.* 
                FROM event_table_chair etc
                JOIN table_chair_arrangement tca ON etc.Arrangement_Id = tca.Arrangement_ID
                JOIN table_reserve tr ON tca.Table_Reserve_ID = tr.Table_Reserve_ID
                JOIN Event e ON etc.Event_ID = e.Event_ID
                WHERE e.booking_id = ?`,
                [bookingId]
            );
            return arrangements;
        } catch (error) {
            console.error("Database Error (getArrangementsByBooking):", error.message);
            throw new Error(error.message || "Failed to get arrangements");
        }
    }
}

export default EventLinkModel;