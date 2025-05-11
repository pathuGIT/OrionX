import PlanBar from "../models/planBarModel.js";

export const createPlanBarEvent = async (req, res) => {
    try {
        const { bookingid } = req.params;
        const { LiquorTimeFrom, LiquorTimeTo, BarPax } = req.body;

        if (!LiquorTimeFrom || !LiquorTimeTo || !BarPax) {
            return res.status(400).json({
                success: false,
                error: "Missing required fields: LiquorTimeFrom, LiquorTimeTo, and BarPax"
            });
        }

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

export const updatePlanBarEvent = async (req, res) => {
    try {
        const { bookingid } = req.params;
        const { LiquorTimeFrom, LiquorTimeTo, BarPax } = req.body;

        if (!LiquorTimeFrom || !LiquorTimeTo || !BarPax) {
            return res.status(400).json({
                success: false,
                error: "Missing required fields: LiquorTimeFrom, LiquorTimeTo, and BarPax"
            });
        }

        const updatedEventID = await PlanBar.updatePlanBar(bookingid, {
            LiquorTimeFrom,
            LiquorTimeTo,
            BarPax
        });

        res.status(200).json({
            success: true,
            eventId: updatedEventID,
            message: "Plan bar updated successfully"
        });

    } catch (error) {
        const statusCode = error.message.includes('No existing') ? 404 : 500;
        res.status(statusCode).json({
            success: false,
            error: error.message
        });
    }
};

export const deletePlanBarEvent = async (req, res) => {
    try {
        const { bookingid } = req.params;

        await PlanBar.deletePlanBar(bookingid);

        res.status(200).json({
            success: true,
            message: "Plan bar deleted successfully"
        });

    } catch (error) {
        const statusCode = error.message.includes('No existing') ? 404 : 500;
        res.status(statusCode).json({
            success: false,
            error: error.message
        });
    }
};

export const getPlanBarEvent = async (req, res) => {
    try {
        const { bookingid } = req.params;

        const planBar = await PlanBar.getPlanBar(bookingid);

        if (!planBar) {
            return res.status(404).json({
                success: false,
                error: "No bar plan found for this booking"
            });
        }

        res.status(200).json({
            success: true,
            data: {
                LiquorTimeFrom: planBar.LiquorTimeFrom,
                LiquorTimeTo: planBar.LiquorTimeTo,
                BarPax: planBar.BarPax,
                BarRequirementID: planBar.BarRequirementID
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};