import db from "../config/db.js";

// CRUD for Item Table
export const getAllItems = async () => {
    const [rows] = await db.query("SELECT * FROM Item");
    return rows;
};

export const getItemById = async (item_id) => {
    const [rows] = await db.query("SELECT * FROM Item WHERE item_id = ?", [item_id]);
    return rows[0];
};

export const createItem = async (item_id, item_name) => {
    const [result] = await db.query(
        "INSERT INTO Item (item_id, item_name) VALUES (?, ?)",
        [item_id, item_name]
    );
    return result.insertId;
};

export const updateItem = async (item_id, item_name) => {
    const [result] = await db.query(
        "UPDATE Item SET item_name = ? WHERE item_id = ?",
        [item_name, item_id]
    );
    return result.affectedRows;
};

export const deleteItem = async (item_id) => {
    const [result] = await db.query("DELETE FROM Item WHERE item_id = ?", [item_id]);
    return result.affectedRows;
};

export default {
    getAllItems,
    getItemById,
    createItem,
    updateItem,
    deleteItem
};