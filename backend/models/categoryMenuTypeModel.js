import db from "../config/db.js";

export const getAllCategoryMenuTypes = async () => {
    const conn = await db.getConnection();
    //const [rows] = await db.query("SELECT * FROM Category_Menu_Type where ");
    try {
        const [rows] = await conn.query("SELECT a.category_menu_type_Id, b.menu_type_name, c.category_name, a.item_limit FROM Category_Menu_Type a, menu_type b, category c where a.menu_type_id = b.menu_type_id and a.category_id = c.category_id");
        return rows;
    } finally {
        conn.release();
    }
};

export const getCategoryMenuTypeById = async (category_menu_type_Id) => {
    const conn = await db.getConnection();
    try {
        const [rows] = await conn.query(
            "SELECT * FROM Category_Menu_Type WHERE category_menu_type_Id = ?",
            [category_menu_type_Id]
        );
        return rows[0];
    } finally {
        conn.release();
    }
};

export const createCategoryMenuType = async (menu_type_id, category_id, item_limit) => {
    const conn = await db.getConnection();
    try {
        const [result] = await conn.query(
            "INSERT INTO Category_Menu_Type (menu_type_id, category_id, item_limit) VALUES (?, ?, ?)",
            [menu_type_id, category_id, item_limit]
        );
        return result.insertId;
    } finally {
        conn.release();
    }
};

export const updateCategoryMenuType = async (category_menu_type_Id, menu_type_id, category_id, item_limit) => {
    const conn = await db.getConnection();
    try {
        const [result] = await conn.query(
            "UPDATE Category_Menu_Type SET menu_type_id = ?, category_id = ?, item_limit = ? WHERE category_menu_type_Id = ?",
            [menu_type_id, category_id, item_limit, category_menu_type_Id]
        );
        return result.affectedRows;
    } finally {
        conn.release();
    }
};

export const deleteCategoryMenuType = async (category_menu_type_Id) => {
    const conn = await db.getConnection();
    try {
        const [result] = await conn.query(
            "DELETE FROM Category_Menu_Type WHERE category_menu_type_Id = ?",
            [category_menu_type_Id]
        );
        return result.affectedRows;
    } finally {
        conn.release();
    }
};

export default {
    getAllCategoryMenuTypes,
    getCategoryMenuTypeById,
    createCategoryMenuType,
    updateCategoryMenuType,
    deleteCategoryMenuType
};
