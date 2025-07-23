import db from "../config/db.js";

export const getAllMenus = async () => {
    const conn = await db.getConnection();
    const [rows] = await conn.query("SELECT * FROM Menu_List_Type");
    conn.release(); // Always release the connection
    return rows;
};

export const getMenuById = async (menu_list_type_id) => {
    const conn = await db.getConnection();
    const [rows] = await conn.query(
        "SELECT * FROM Menu_List_Type WHERE menu_list_type_id = ?",
        [menu_list_type_id]
    );
    conn.release(); // Always release the connection
    return rows[0];
};

export const createMenu = async ( menu_list_name) => {
    const conn = await db.getConnection();
    console.log("menu_list_name",menu_list_name);
    const [result] = await conn.query(
        "INSERT INTO Menu_List_Type ( menu_list_name) VALUES (?)",
        [menu_list_name]
    );
    conn.release(); // Always release the connection
    return result.insertId;
};

export const updateMenu = async (menu_list_type_id, menu_list_name) => {
    const conn = await db.getConnection();
    const [result] = await conn.query(
        "UPDATE Menu_List_Type SET menu_list_name = ? WHERE menu_list_type_id = ?",
        [menu_list_name, menu_list_type_id]
    );
    conn.release(); // Always release the connection
    return result.affectedRows;
};

export const deleteMenu = async (menu_list_type_id) => {
    const conn = await db.getConnection();
    const [result] = await conn.query(
        "DELETE FROM Menu_List_Type WHERE menu_list_type_id = ?",
        [menu_list_type_id]
    );
    conn.release(); // Always release the connection
    return result.affectedRows;
};

export default {
    getAllMenus,
    getMenuById,
    createMenu,
    updateMenu,
    deleteMenu
};