import Menu from "../models/menuModel.js";

// Get all menus
export const getMenus = async (req, res) => {
    try {
        const menus = await Menu.getMenus();
        res.json(menus);
    } catch (error) {
        res.status(500).json({ error: "Database error" });
    }
};

// Create a new menu
export const createMenu = async (req, res) => {
    const { menu_name, eventType_id, menuType_id, description, price } = req.body;
    try {
        const result = await Menu.createMenu(menu_name, eventType_id, menuType_id, description, price);
        res.status(201).json({ message: "Menu added", menuId: result.insertId });
    } catch (error) {
        res.status(500).json({ error: "Error inserting menu" });
    }
};
