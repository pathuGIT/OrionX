import CustomerDashboardModel from '../models/customerDashboardModel.js';

export const getEventProgress = async (req, res) => {
    try {
        const { bookingId } = req.params;
        if (!bookingId) {
            return res.status(400).json({ message: 'Booking ID is required' });
        }

        const progress = await CustomerDashboardModel.getPlanningStatus(bookingId);
        res.status(200).json(progress);
    } catch (error) {
        console.error('Error fetching event progress:', error);
        res.status(500).json({ 
            message: 'Failed to get event progress',
            error: error.message
        });
    }
};