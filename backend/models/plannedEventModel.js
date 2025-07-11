import db from "../config/db.js";

class plannedEvent {
    static async getPlannedEvent(customerID, bookingID) {
        try {
            // Add b.booking_id = ? to the WHERE clause
            const [results] = await db.query(
                `SELECT 
                    e.Event_ID, 
                    e.Buffet_TimeFrom, 
                    e.Buffet_TimeTo, 
                    e.Additional_Time, 
                    e.Function_durationFrom, 
                    e.Function_durationTo, 
                    e.Tea_table_Time, 
                    e.Dress_Time, 
                    w.Groom_Name, 
                    w.Bride_Name, 
                    w.Groom_Contact_no, 
                    w.Bride_Contact_no, 
                    w.Fountain, 
                    w.ProsperityTable, 
                    w.Poruwa_CeremonyFrom, 
                    w.Poruwa_CeremonyTo, 
                    w.Registration_Time, 
                    c.Event_Name AS Custom_Event_Name, 
                    c.ContactPersonName, 
                    c.ContactPersonNumber
                FROM booking b
                LEFT JOIN event e ON b.booking_id = e.booking_id
                LEFT JOIN wedding w ON e.Event_ID = w.Event_ID
                LEFT JOIN customevent c ON e.Event_ID = c.Event_ID
                WHERE b.customer_id = ? AND b.booking_id = ?`,
                [customerID, bookingID] // Pass both IDs as parameters
            );

            return results;
        } catch (error) {
            console.error("Database Error:", error);
            throw new Error("Failed to fetch event details.");
        }
    }
}

export default plannedEvent;
