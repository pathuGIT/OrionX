import plannedEvent from '../models/plannedEventModel.js'; // Import the plannedEvent model

export const getPlannedEvents = async (req, res) => {
    try {
        // Get customerID and bookingID from request parameters
        const { customerID, bookingID } = req.params;
        console.log(`Fetching events for customer ID: ${customerID} and booking ID: ${bookingID}`);

        if (!customerID || !bookingID) {
            return res.status(400).json({ success: false, message: "Customer ID and Booking ID are required." });
        }

        // Pass both IDs to the model function
        const events = await plannedEvent.getPlannedEvent(customerID, bookingID);

        if (!events || events.length === 0) {
            return res.status(404).json({ success: false, message: "No event found for this customer and booking." });
        }

        res.status(200).json({ success: true, message: "Event retrieved successfully", data: events });
    } catch (error) {
        console.error("Error fetching planned event:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
