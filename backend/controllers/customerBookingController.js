import customerBookingModel from '../models/customerBookingModel.js';  // Make sure this line exists!


export const customerBookingController = async (req, res) => {
    try {
        const customerID = req.params.customerID; // No need for destructuring
        console.log("Customer ID received:", customerID);
        if (!customerID) {
            return res.status(400).json({ message: "Customer ID is required." });
        }

        // Fix function call: Pass as an object
        const bookings = await customerBookingModel.getCustomerBooking({ customerID });

        if (!bookings || bookings.length === 0) {
            return res.status(404).json({ message: "No bookings found for this customer." });
        }

        res.status(200).json({ success: true, data: bookings });
    } catch (error) {
        console.error("Error in getCustomerBookingController:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
