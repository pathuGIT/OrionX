import TableChairArrangementModel from '../models/tableChairArrangementModel.js';
import EventLinkModel from '../models/eventTableChairModel.js';

// Create new table reservation
export const createReservation = async (req, res) => {
    try {
        const { bookingid } = req.params;
        const { tableNumber, reserveName } = req.body;
        console.log("Booking IDs:", bookingid);

        

        if (!tableNumber || !reserveName) {
            return res.status(400).json({
                success: false,
                error: "Missing required fields: tableNumber and reserveName"
            });
        }

        const reservationId = await TableChairArrangementModel.createReservation(
            bookingid,
            { tableNumber, reserveName }
        );

        res.status(201).json({
            success: true,
            reservationId,
            message: "Table reservation created successfully"
        });

    } catch (error) {
        const statusCode = error.message.includes('exists') ? 409 : 500;
        res.status(statusCode).json({
            success: false,
            error: error.message
        });
    }
};

// Create new chair arrangement
export const createArrangement = async (req, res) => {
    try {
        const { bookingid } = req.params;
        const arrangementData = req.body;

        console.log("Booking IDs:", bookingid);

        // Validate required fields
        const requiredFields = ['headPax', 'topClothColor', 'tableClothColor', 
                              'bowColor', 'chairCoverColor'];
        const missingFields = requiredFields.filter(field => !arrangementData[field]);
        
        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                error: `Missing required fields: ${missingFields.join(', ')}`
            });
        }

        const arrangementId = await TableChairArrangementModel.createArrangement(
            bookingid,
            arrangementData
        );

        res.status(201).json({
            success: true,
            arrangementId,
            message: "Table/chair arrangement created successfully"
        });

    } catch (error) {
        const statusCode = error.message.includes('not found') ? 404 : 500;
        res.status(statusCode).json({
            success: false,
            error: error.message
        });
    }
};

// Get all arrangements by booking ID
export const getArrangementsByBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const arrangements = await EventLinkModel.getArrangementsByBooking(bookingId);

        if (!arrangements.length) {
            return res.status(404).json({
                success: false,
                error: "No arrangements found for this booking"
            });
        }

        res.status(200).json({
            success: true,
            count: arrangements.length,
            data: arrangements
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Export all functions as named exports
export default {
    createReservation,
    createArrangement,
    getArrangementsByBooking
};