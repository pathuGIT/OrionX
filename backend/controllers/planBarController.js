import PlanBar from "../models/planBarModel.js";

export const createPlanBarEvent = async (req, res) => {
    try {
        const { bookingid } = req.params;
        const { LiquorTimeFrom, LiquorTimeTo, BarPax } = req.body;

        // Validate required fields
        if (!LiquorTimeFrom || !LiquorTimeTo || !BarPax) {
            return res.status(400).json({
                success: false,
                error: "Missing required fields: LiquorTimeFrom, LiquorTimeTo, and BarPax"
            });
        }

        // Create plan bar event
        const newEventID = await PlanBar.createPlanBar(bookingid, {
            LiquorTimeFrom,
            LiquorTimeTo,
            BarPax
        });

        res.status(201).json({
            success: true,
            eventId: newEventID,
            message: "Plan bar event created successfully"
        });

    } catch (error) {
        const statusCode = error.message.includes('exists') ? 409 : 500;
        res.status(statusCode).json({
            success: false,
            error: error.message
        });
    }
};