import plannedEvent from '../models/plannedEventModel.js'; // Import the plannedEvent model

export const getPlannedEvents = async (req, res) => {
    try {
        const customerID = req.params.customerID; // Get customer ID from request parameters
        console.log("Fetching events for customer ID:", customerID); // Log customer ID

        if (!customerID) {
            return res.status(400).json({ success: false, message: "Customer ID is required." });
        }

        // ✅ Get events without using res in the model
        const events = await plannedEvent.getPlannedEvent(customerID);

        if (!events || events.length === 0) {
            return res.status(404).json({ success: false, message: "No events found for this customer." });
        }

        // ✅ Send response here
        res.status(200).json({ success: true, message: "Events retrieved successfully", data: events });
    } catch (error) {
        console.error("Error fetching planned events:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
