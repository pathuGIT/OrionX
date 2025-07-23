import db from "../config/db.js";

// CRUD for Item Table
export const getAllItems = async () => {
    const conn = await db.getConnection();
    const [rows] = await conn.query("SELECT * FROM Item");
    conn.release(); // Always release the connection
    return rows;
};

export const getItemById = async (item_id) => {
    const conn = await db.getConnection();
    const [rows] = await conn.query("SELECT * FROM Item WHERE item_id = ?", [item_id]);
    conn.release(); // Always release the connection
    return rows[0];
};

export const createItem = async (item_name) => {
    const conn = await db.getConnection();
    const [result] = await conn.query(
        "INSERT INTO Item (item_name) VALUES (?)",
        [item_name]
    );
    conn.release(); // Always release the connection
    return result.insertId;
};

export const updateItem = async (item_id, item_name) => {
    const conn = await db.getConnection();
    const [result] = await conn.query(
        "UPDATE Item SET item_name = ? WHERE item_id = ?",
        [item_name, item_id]
    );
    conn.release(); // Always release the connection
    return result.affectedRows;
};

export const deleteItem = async (item_id) => {
    const conn = await db.getConnection();
    const [result] = await conn.query("DELETE FROM Item WHERE item_id = ?", [item_id]);
    conn.release(); // Always release the connection
    return result.affectedRows;
};

export default {
    getAllItems,
    getItemById,
    createItem,
    updateItem,
    deleteItem
};