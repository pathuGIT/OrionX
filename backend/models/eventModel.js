import db from '../config/db.js';

class EventModel {
    static async createEvents(eventData) {
        const conn = await db.getConnection();
        try {
            // Insert into Event table
            const [result] = await conn.query(
                `INSERT INTO Event (Buffet_TimeFrom, Buffet_TimeTo, 
                Function_durationFrom, Function_durationTo, Tea_table_Time, Dress_Time, booking_id) 
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                    eventData.buffetTimeFrom, 
                    eventData.buffetTimeTo, 
                    eventData.functionDurationFrom, 
                    eventData.functionDurationTo, 
                    eventData.teaTableTime, 
                    eventData.dressTime, 
                    eventData.bookingID
                ]
            );

            const [NewEventID] = await conn.query(
                `SELECT Event_ID FROM Event WHERE booking_id = ?`,
                [eventData.bookingID]
            );
            let newEventID = NewEventID[0].Event_ID;

            await conn.query(
                `INSERT INTO CustomEvent (Event_ID, Event_Name, ContactPersonName, ContactPersonNumber) 
                VALUES (?, ?, ?, ?)`,
                [newEventID, eventData.eventName, eventData.contactPersonName, eventData.contactPersonNumber]
            );
            return newEventID; 

        } catch (error) {
            console.error("Database Error (createEvents):", error.message || error);
            throw new Error(error.message || "Failed to create event.");
        } finally {
            conn.release();
        }
    }
}

export default EventModel;
