import db from "../config/db.js";

export const getAllMenuTypes = async () => {
    const [rows] = await db.query("SELECT * FROM Menu_Type");
    return rows;
};

export const getMenuTypeById = async (menu_type_id) => {
    const [rows] = await db.query(
        "SELECT * FROM Menu_Type WHERE menu_type_id = ?",
        [menu_type_id]
    );
    return rows[0];z
};

export const createMenuType = async (menu_type_name, menu_list_type_id, price) => {
    const [result] = await db.query(
        "INSERT INTO Menu_Type (menu_type_name, menu_list_type_id, price) VALUES (?, ?, ?)",
        [ menu_type_name, menu_list_type_id, price]
    );
    return result.insertId;
};

export const updateMenuType = async (menu_type_id, menu_type_name, menu_list_type_id, price) => {
    console.log(menu_type_id, menu_type_name, menu_list_type_id, price)
    const [result] = await db.query(
        "UPDATE Menu_Type SET menu_type_name = ?, menu_list_type_id = ?, price = ? WHERE menu_type_id = ?",
        [menu_type_name, menu_list_type_id, price, menu_type_id]
    );
    return result.affectedRows;
};

export const deleteMenuType = async (menu_type_id) => {
    const [result] = await db.query(
        "DELETE FROM Menu_Type WHERE menu_type_id = ?",
        [menu_type_id]
    );
    return result.affectedRows;
};

export default {
    getAllMenuTypes,
    getMenuTypeById,
    createMenuType,
    updateMenuType,
    deleteMenuType
};
