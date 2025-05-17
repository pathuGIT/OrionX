import PlanBite from "../models/planBiteModel.js";

export const getBiteMenuItems = async (req, res) => {
    try {
        const menuItems = await PlanBite.getBiteMenuItems();
        
        res.status(200).json({
            success: true,
            data: menuItems,
            message: "Bite menu items fetched successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

export const createBiteMenu = async (req, res) => {
    try {
        const { bookingid } = req.params;
        const { biteItems } = req.body;

        if (!biteItems || !Array.isArray(biteItems) || biteItems.length === 0) {
            return res.status(400).json({
                success: false,
                error: "Please provide at least one bite menu item with quantity"
            });
        }

        const { totalPrice } = await PlanBite.PlanBiteMenu(bookingid, biteItems);

        res.status(201).json({
            success: true,
            totalPrice,
            message: "Bite menu created successfully"
        });

    } catch (error) {
        const statusCode = error.message.includes('not found') ? 404 : 500;
        res.status(statusCode).json({
            success: false,
            error: error.message
        });
    }
};

export const getBiteMenu = async (req, res) => {
    try {
        const { bookingid } = req.params;
        const { biteItems, totalPrice } = await PlanBite.getBiteMenu(bookingid);

        res.status(200).json({
            success: true,
            data: {
                biteItems,
                totalPrice
            },
            message: "Bite menu fetched successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

export const updateBiteMenu = async (req, res) => {
    try {
        const { bookingid } = req.params;
        const { biteItems } = req.body;

        if (!biteItems || !Array.isArray(biteItems)) {
            return res.status(400).json({
                success: false,
                error: "Please provide valid bite items array"
            });
        }

        const { totalPrice } = await PlanBite.UpdateBiteMenu(bookingid, biteItems);

        res.status(200).json({
            success: true,
            totalPrice,
            message: "Bite menu updated successfully"
        });

    } catch (error) {
        const statusCode = error.message.includes('No existing') ? 404 : 500;
        res.status(statusCode).json({
            success: false,
            error: error.message
        });
    }
};

export const deleteBiteMenu = async (req, res) => {
    try {
        const { bookingid } = req.params;

        await PlanBite.deleteBiteMenu(bookingid);

        res.status(200).json({
            success: true,
            message: "Bite menu deleted successfully"
        });

    } catch (error) {
        const statusCode = error.message.includes('No existing') ? 404 : 500;
        res.status(statusCode).json({
            success: false,
            error: error.message
        });
    }
};