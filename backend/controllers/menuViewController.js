import { getAllMenuViewsModel, getMenuViewByIdModel } from "../models/menuViewModel.js";


// Controllers for Menu View
export const getAllMenuViews = async (req, res) => {
    try {
        const menuViews = await getAllMenuViewsModel();
        res.status(200).json(menuViews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getMenuViewById = async (req, res) => {
    const { id } = req.params;
    try {
        const menuView = await getMenuViewByIdModel(id);
        if (menuView) {
            res.json(menuView);
        } else {
            res.status(404).json({ message: "Menu view not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export default {
    getAllMenuViews,
    getMenuViewById,
};