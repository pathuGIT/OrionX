import customerBookingModel from '../models/customerBookingModel.js';  

export const getCustomerBookings = async (req, res) => {
    try {
        const { customerID } = req.params; // Extract parameter
        console.log("Customer ID received:", customerID);

        if (!customerID) {
            return res.status(400).json({ success: false, message: "Customer ID is required." });
        }

        const bookings = await customerBookingModel.getCustomerBooking(customerID);

        if (!bookings || bookings.length === 0) {
            return res.status(404).json({ success: false, message: "No bookings found for this customer." });
        }

        res.status(200).json({ success: true, data: bookings });
    } catch (error) {
        console.error("Error fetching customer bookings:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
