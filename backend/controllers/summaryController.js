import SummaryModel from "../models/summaryModel.js";

// Controller to get summary by booking_id
export const getSummary = async (req, res) => {
    try {
        const bookingId = req.params.booking_id;
        const summary = await SummaryModel.getSummaryByBookingId(bookingId);
        
        if (summary && summary.length > 0) {
            res.json(summary);
        } else {
            res.status(404).json({ message: "No summary found for the given booking ID" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export default {
    getSummary
};
