import EventServiceModel from '../models/eventServiceModel.js';

export const getEventServices = async (req, res) => {
    try {
        const services = await EventServiceModel.getEventServices();
        
        res.status(200).json({
            success: true,
            data: services || []
        });
    } catch (error) {
        console.error("Error fetching event services:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
