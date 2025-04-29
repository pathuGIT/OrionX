// controllers/eventServiceController.js
import EventServiceModel from '../models/eventServiceModel.js';
export const getEventServices = async (req, res) => {
    try {
        const services = await EventServiceModel.getEventServices();
        
        // Return empty array instead of 404 if no services found
        res.status(200).json({
            success: true,
            data: services || []
        });
        
    } catch (error) {
        console.error("Error fetching event services:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
};