import db from "../config/db.js";

export const getAllCategories = async () => {
    const [rows] = await db.query("SELECT * FROM Category");
    return rows;
};

export const getCategoryById = async (category_id) => {
    const [rows] = await db.query(
        "SELECT * FROM Category WHERE category_id = ?",
        [category_id]
    );
    return rows[0];
};

export const createCategory = async (category_id, category_name) => {
    const [result] = await db.query(
        "INSERT INTO Category (category_id, category_name) VALUES (?, ?)",
        [category_id, category_name]
    );
    return result.insertId;
};

export const updateCategory = async (category_id, category_name) => {
    const [result] = await db.query(
        "UPDATE Category SET category_name = ? WHERE category_id = ?",
        [category_name, category_id]
    );
    return result.affectedRows;
};

export const deleteCategory = async (category_id) => {
    const [result] = await db.query(
        "DELETE FROM Category WHERE category_id = ?",
        [category_id]
    );
    return result.affectedRows;
};

export default {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};
