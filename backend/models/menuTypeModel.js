import db from "../config/db.js";

export const getAllMenuTypes = async () => {
    const conn = await db.getConnection();
    const [rows] = await conn.query("SELECT * FROM Menu_Type");
    conn.release(); // Always release the connection
    return rows;
};

export const getMenuTypeById = async (menu_type_id) => {
    const conn = await db.getConnection();
    const [rows] = await conn.query(
        "SELECT * FROM Menu_Type WHERE menu_type_id = ?",
        [menu_type_id]
    );
    conn.release(); // Always release the connection
    return rows[0];z
};

export const createMenuType = async (menu_type_name, menu_list_type_id, price) => {
    const conn = await db.getConnection();
    const [result] = await conn.query(
        "INSERT INTO Menu_Type (menu_type_name, menu_list_type_id, price) VALUES (?, ?, ?)",
        [ menu_type_name, menu_list_type_id, price]
    );
    conn.release(); // Always release the connection
    return result.insertId;
};

export const updateMenuType = async (menu_type_id, menu_type_name, menu_list_type_id, price) => {
    const conn = await db.getConnection();
    console.log(menu_type_id, menu_type_name, menu_list_type_id, price)
    const [result] = await conn.query(
        "UPDATE Menu_Type SET menu_type_name = ?, menu_list_type_id = ?, price = ? WHERE menu_type_id = ?",
        [menu_type_name, menu_list_type_id, price, menu_type_id]
    );
    conn.release(); // Always release the connection
    return result.affectedRows;
};

export const deleteMenuType = async (menu_type_id) => {
    const conn = await db.getConnection();
    const [result] = await conn.query(
        "DELETE FROM Menu_Type WHERE menu_type_id = ?",
        [menu_type_id]
    );
    conn.release(); // Always release the connection
    return result.affectedRows;
};

export default {
    getAllMenuTypes,
    getMenuTypeById,
    createMenuType,
    updateMenuType,
    deleteMenuType
};
