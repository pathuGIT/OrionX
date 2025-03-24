import db from "../config/db.js";

export const getAllCategoryMenuTypes = async () => {
    const [rows] = await db.query("SELECT * FROM Category_Menu_Type");
    return rows;
};

export const getCategoryMenuTypeById = async (category_menu_type_Id) => {
    const [rows] = await db.query(
        "SELECT * FROM Category_Menu_Type WHERE category_menu_type_Id = ?",
        [category_menu_type_Id]
    );
    return rows[0];
};

export const createCategoryMenuType = async (category_menu_type_Id, menu_type_id, category_id, item_limit) => {
    const [result] = await db.query(
        "INSERT INTO Category_Menu_Type (category_menu_type_Id, menu_type_id, category_id, item_limit) VALUES (?, ?, ?, ?)",
        [category_menu_type_Id, menu_type_id, category_id, item_limit]
    );
    return result.insertId;
};

export const updateCategoryMenuType = async (category_menu_type_Id, menu_type_id, category_id, item_limit) => {
    const [result] = await db.query(
        "UPDATE Category_Menu_Type SET menu_type_id = ?, category_id = ?, item_limit = ? WHERE category_menu_type_Id = ?",
        [menu_type_id, category_id, item_limit, category_menu_type_Id]
    );
    return result.affectedRows;
};

export const deleteCategoryMenuType = async (category_menu_type_Id) => {
    const [result] = await db.query(
        "DELETE FROM Category_Menu_Type WHERE category_menu_type_Id = ?",
        [category_menu_type_Id]
    );
    return result.affectedRows;
};

export default {
    getAllCategoryMenuTypes,
    getCategoryMenuTypeById,
    createCategoryMenuType,
    updateCategoryMenuType,
    deleteCategoryMenuType
};
