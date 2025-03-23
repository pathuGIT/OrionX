import pool from '../config/db.js';

// Get all menus
export const getMenus = async () => {
    const [rows] = await pool.query("SELECT * FROM Menu");
    return rows;
};

// Create a new menu
export const createMenu = async (menu_name, eventType_id, menuType_id, description, price) => {
    const result = await pool.query(
        "INSERT INTO Menu (menu_name, eventType_id, menuType_id, description, price) VALUES (?, ?, ?, ?, ?)",
        [menu_name, eventType_id, menuType_id, description, price]
    );
    return result[0];
};