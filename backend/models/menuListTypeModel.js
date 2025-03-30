import db from "../config/db.js";

export const getAllMenus = async () => {
    const [rows] = await db.query("SELECT * FROM Menu_List_Type");
    return rows;
};

export const getMenuById = async (menu_list_type_id) => {
    const [rows] = await db.query(
        "SELECT * FROM Menu_List_Type WHERE menu_list_type_id = ?",
        [menu_list_type_id]
    );
    return rows[0];
};

export const createMenu = async ( menu_list_name) => {
    console.log("menu_list_name",menu_list_name);
    const [result] = await db.query(
        "INSERT INTO Menu_List_Type ( menu_list_name) VALUES (?)",
        [menu_list_name]
    );
    return result.insertId;
};

export const updateMenu = async (menu_list_type_id, menu_list_name) => {
    const [result] = await db.query(
        "UPDATE Menu_List_Type SET menu_list_name = ? WHERE menu_list_type_id = ?",
        [menu_list_name, menu_list_type_id]
    );
    return result.affectedRows;
};

export const deleteMenu = async (menu_list_type_id) => {
    const [result] = await db.query(
        "DELETE FROM Menu_List_Type WHERE menu_list_type_id = ?",
        [menu_list_type_id]
    );
    return result.affectedRows;
};

export default {
    getAllMenus,
    getMenuById,
    createMenu,
    updateMenu,
    deleteMenu
};