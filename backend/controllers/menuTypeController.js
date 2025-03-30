import MenuTypeModel from "../models/menuTypeModel.js";

export const getAllMenuTypes = async (req, res) => {
    try {
        const menuTypes = await MenuTypeModel.getAllMenuTypes();
        res.json(menuTypes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getMenuTypeById = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("menu_type_id", id);
        const menuType = await MenuTypeModel.getMenuTypeById(id);

        if (!menuType) {
            return res.status(404).json({ error: "Menu Type not found" });
        }

        res.json(menuType);
    } catch (error) {
        res.status(500).json({ error: "Database error" });
    }
};


export const createMenuType = async (req, res) => {
    try {
        const {menu_type_name, menu_list_type_id, price } = req.body;
        await MenuTypeModel.createMenuType(menu_type_name, menu_list_type_id, price);
        res.status(201).json({ message: "Menu Type created successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateMenuType = async (req, res) => {
    try {
        const { menu_type_name, menu_list_type_id, price } = req.body;
        const updated = await MenuTypeModel.updateMenuType(req.params.id, menu_type_name, menu_list_type_id, price);
        if (updated === 0) {
            return res.status(404).json({ message: "Menu Type not found" });
        }
        res.json({ message: "Menu Type updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteMenuType = async (req, res) => {
    try {
        const deleted = await MenuTypeModel.deleteMenuType(req.params.id);
        if (deleted === 0) {
            return res.status(404).json({ message: "Menu Type not found" });
        }
        res.json({ message: "Menu Type deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export default {
    getAllMenuTypes,
    getMenuTypeById,
    createMenuType,
    updateMenuType,
    deleteMenuType
};
