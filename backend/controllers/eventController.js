// controllers/eventController.js

import Event from '../models/eventModel.js'; // Import the Event model

export const createEvents = async (req, res) => {
    try {
        const eventData = req.body;
        console.log("Received event data:", eventData); // Log received data

        if (!eventData) {
            return res.status(400).json({ success: false, message: "Event data is required." });
        }

        // Ensure Event.createEvent returns a Promise instead of using callbacks
        const event = await Event.createEvents(eventData);

        res.status(201).json({ success: true, message: "Event details saved successfully", data: event });
    } catch (error) {
        console.error("Error creating event:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


