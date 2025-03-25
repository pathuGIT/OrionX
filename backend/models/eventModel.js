// models/eventModel.js
import db from '../config/db.js'; // Adjust the import if using ES modules

const Event = {
    create: (eventData, callback) => {
        const sql = `INSERT INTO Event (EventType, EventDate, Pax, Menu, ContactPersonName, ContactPersonNumber) VALUES (?, ?, ?, ?, ?, ?)`;
        const values = [eventData.eventType, eventData.eventDate, eventData.pax, eventData.menu, eventData.contactPersonName, eventData.contactPersonNumber];

        db.query(sql, values, (err, results) => {
            if (err) {
                return callback(err);
            }
            callback(null, results.insertId);
        });
    }
};

export default Event; // Default export