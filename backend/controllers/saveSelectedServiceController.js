import saveSelectedServiceModel from '../models/saveSelectedServiceModel.js';

export const saveSelectedServices = async (req, res) => {
    try {
        const { customerId, bookingId, serviceIds } = req.body;
        
        if (!customerId || !bookingId || !Array.isArray(serviceIds)) {
            return res.status(400).json({
                success: false,
                message: 'Missing required parameters'
            });
        }

        await saveSelectedServiceModel.saveSelectedServices(
            customerId,
            bookingId,
            serviceIds
        );
        
        res.status(200).json({
            success: true,
            message: 'Services saved for booking',
            data: {
                bookingId,
                customerId,
                selectedServices: serviceIds
            }
        });
        
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error'
        });
    }
};