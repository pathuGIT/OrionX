import TableChairArrangementModel from '../models/tableChairArrangementModel.js';
import EventLinkModel from '../models/eventTableChairModel.js';

// Create new table reservation
export const createReservation = async (req, res) => {
    try {
        const { bookingid } = req.params;
        const { tableNumber, reserveName } = req.body;

        

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

        const arrangementId = await TableChairArrangementModel.createOrUpdateArrangement(
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

export const getAllTableswithDesigns = async (req, res) => {
    try {
        const designs = await EventLinkModel.getAllDesigns();
        res.status(200).json(designs);
    } catch (error) {
        console.error('Error fetching designs:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Get all arrangements by booking ID
export const getArrangementsByBooking = async (req, res) => {
    try {
        const { bookingid } = req.params;
        const arrangements = await EventLinkModel.getArrangementsByBooking(bookingid);

        if (!arrangements.length) {
            return res.status(404).json({
                success: false,
                error: "No arrangements found for this booking"
            });
        }

        // Transform data for frontend
        const transformed = arrangements.map(arr => ({
            Arrangement_ID: arr.Arrangement_ID,
            Head_Table_Pax: arr.Head_Table_Pax,
            Colors: {
                Top: arr.Top_Cloth_Color,
                Table: arr.Table_Cloth_Color,
                Bow: arr.Bow_Color,
                Chair: arr.Chair_Cover_Color
            },
            UpdatedAt: arr.updated_at || new Date().toISOString(),
            Reservations: arr.Reservations
        }));

        res.status(200).json(transformed);
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