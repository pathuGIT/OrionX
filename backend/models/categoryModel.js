import db from "../config/db.js";

export const getAllCategories = async () => {
    const conn = await db.getConnection();
    try {
        const [rows] = await conn.query("SELECT * FROM Category");
        return rows;
    } finally {
        conn.release();
    }
};

export const getCategoryById = async (category_id) => {
    const conn = await db.getConnection();
    try {
        const [rows] = await conn.query(
            "SELECT * FROM Category WHERE category_id = ?",
            [category_id]
        );
        return rows[0];
    } finally {
        conn.release();
    }
};

export const createCategory = async (category_name) => {
    const conn = await db.getConnection();
    try {
        const [result] = await conn.query(
            "INSERT INTO Category (category_name) VALUES (?)",
            [category_name]
        );
        return result.insertId;
    } finally {
        conn.release();
    }
};

export const updateCategory = async (category_id, category_name) => {
    const conn = await db.getConnection();
    try {
        const [result] = await conn.query(
            "UPDATE Category SET category_name = ? WHERE category_id = ?",
            [category_name, category_id]
        );
        return result.affectedRows;
    } finally {
        conn.release();
    }
};

export const deleteCategory = async (category_id) => {
    const conn = await db.getConnection();
    try {
        const [result] = await conn.query(
            "DELETE FROM Category WHERE category_id = ?",
            [category_id]
        );
        return result.affectedRows;
    } finally {
        conn.release();
    }
};

export default {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};
