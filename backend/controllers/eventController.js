// controllers/eventController.js
import Event from '../models/eventModel.js'; // Default import

export const createEvent = (req, res) => {
    const eventData = req.body;

    Event.create(eventData, (err, eventId) => {
        if (err) {
            console.error('Error creating event:', err);
            return res.status(500).json({ error: 'Database error.' });
        }
        res.status(201).json({ message: 'Event created successfully!', eventId });
    });
};