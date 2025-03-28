import db from '../config/db.js';

class EventModel {
    static async create(eventData) {
        try {
            // Insert into Event table
            const [result] = await db.query(
                `INSERT INTO Event (Buffet_TimeFrom, Buffet_TimeTo, Additional_Time, 
                Function_durationFrom, Function_durationTo, Tea_table_Time, Dress_Time, booking_id) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    eventData.buffetTimeFrom, eventData.buffetTimeTo, eventData.additionalTime, 
                    eventData.functionDurationFrom, eventData.functionDurationTo, eventData.teaTableTime, 
                    eventData.dressTime, eventData.bookingID
                ]
            );

            const [eventResult] = await db.query(
                `SELECT Event_ID FROM Event WHERE booking_id = ?`, [eventData.bookingID]
            );

            // Check if Event_ID was found
            if (eventResult.length === 0) {
                throw new Error("Event_ID not found for the given booking_id.");
            }

            const eventID = eventResult[0].Event_ID;  // Extract the Event_ID

            // Log the Event_ID (optional for debugging)
            console.log("Event inserted with ID:", eventID);

            // If no event name is provided, skip inserting into CustomEvent
            if (!eventData.eventName) {
                console.warn("No event name provided, skipping CustomEvent insert.");
                return eventID;  // Returning the Event_ID
            }

            const [customResult] = await db.query(
                `INSERT INTO CustomEvent (Event_ID, Event_Name, ContactPersonName, ContactPersonNumber) 
                VALUES (?, ?, ?, ?)`,
                [eventID, eventData.eventName, eventData.contactPersonName, eventData.contactPersonNumber]
            );

            console.log("CustomEvent inserted with Event_ID:", eventID);

            return customResult.insertId; // Return the inserted CustomEvent's ID (optional)

        } catch (error) {
            console.error("Database Error (createEvent):", error);
            throw new Error("Failed to create event.");
        }
    }
}

export default EventModel;