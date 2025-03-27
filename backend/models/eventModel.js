import db from '../config/db.js';

const EventModel = {
    create: (eventData, callback) => {
        const eventSql = `INSERT INTO Event (
            Buffet_TimeFrom, Buffet_TimeTo, Additional_Time, 
            Function_durationFrom, Function_durationTo, Tea_table_Time, 
            Dress_Time, booking_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

        const eventValues = [
            eventData.buffetTimeFrom, eventData.buffetTimeTo, eventData.additionalTime, 
            eventData.functionDurationFrom, eventData.functionDurationTo, eventData.teaTableTime, 
            eventData.dressTime, eventData.bookingID
        ];

        db.query(eventSql, eventValues, (err, results) => {
            if (err) {
                console.error("Error inserting into Event:", err);
                return callback(err);
            }

            console.log("Event inserted successfully, ID:", results.insertId);
            
            // Check if eventName exists
            if (!eventData.eventName) {
                console.warn("No event name provided, skipping CustomEvent insert.");
                return callback(null, results.insertId);
            }

            console.log("Inserting into CustomEvent:", eventData.eventName, eventData.contactPersonName, eventData.contactPersonNumber);

            const customEventSql = `INSERT INTO CustomEvent (Event_Name, ContactPersonName, ContactPersonNumber) VALUES (?, ?, ?)`;
            const customEventValues = [
                eventData.eventName, eventData.contactPersonName, eventData.contactPersonNumber
            ];

            db.query(customEventSql, customEventValues, (err, results) => {
                if (err) {
                    console.error("Error inserting into CustomEvent:", err);
                    return callback(err);
                }

                console.log("CustomEvent inserted successfully");
                callback(null, results.insertId);
            });
        });
    }
};

export default EventModel;
