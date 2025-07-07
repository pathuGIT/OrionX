import { LiquorItem, SoftDrinkItem, BarManager } from '../models/barModel.js';

export const barController = {
    addLiquorItem: async (req, res) => {
        try {
            const { booking_id } = req.params;
            const item = await LiquorItem.addItem(booking_id, req.body);

            res.status(201).json({
                success: true,
                data: item,
                message: 'Liquor item added successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    },

    addSoftDrinkItem: async (req, res) => {
        try {
            const { booking_id } = req.params;
            const item = await SoftDrinkItem.addItem(booking_id, req.body);

            res.status(201).json({
                success: true,
                data: item,
                message: 'Soft drink item added successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    },

    getBarDetails: async (req, res) => {
        try {
            const { booking_id } = req.params;
            const details = await BarManager.getBarDetails(booking_id);

            if (!details.barDetails) {
                return res.status(404).json({
                    success: false,
                    error: 'No bar plan found for this booking'
                });
            }

            res.status(200).json({
                success: true,
                data: {
                    ...details.barDetails,
                    liquorItems: details.liquorItems,
                    softDrinkItems: details.softDrinkItems
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    },


    updateLiquorItem: async (req, res) => {
        try {
            const { booking_id, item_id } = req.params;
            await LiquorItem.updateItem(booking_id, item_id, req.body);

            res.status(200).json({
                success: true,
                message: 'Liquor item updated successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    },

    deleteLiquorItem: async (req, res) => {
        try {
            const { booking_id, item_id } = req.params;
            await LiquorItem.deleteItem(booking_id, item_id);

            res.status(200).json({
                success: true,
                message: 'Liquor item deleted successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    },

    deleteSoftDrinkItem: async (req, res) => {
        try {
            const { booking_id, item_id } = req.params;
            await SoftDrinkItem.deleteItem(booking_id, item_id);

            res.status(200).json({
                success: true,
                message: 'Soft drink item deleted successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    },


    updateSoftDrinkItem: async (req, res) => {
        try {
            const { booking_id, item_id } = req.params;
            await SoftDrinkItem.updateItem(booking_id, item_id, req.body);

            res.status(200).json({
                success: true,
                message: 'Soft drink item updated successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

};

