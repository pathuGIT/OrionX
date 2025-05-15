import ServiceVendorModel from '../models/serviceVendorModel.js';

export const getVendorsForCustomerBooking = async (req, res) => {
    try {
        const { customerId, bookingId } = req.params;
        //console.log("booking ID:", bookingId);
        
        if (!customerId || !bookingId) {
            return res.status(400).json({
                success: false,
                message: "Missing customer ID or booking ID"
            });
        }

        const vendors = await ServiceVendorModel.getVendorsByCustomerBooking(customerId, bookingId);
        
        res.status(200).json({
            success: true,
            data: vendors
        });
        
    } catch (error) {
        console.error("Error fetching vendors:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
};