import db from "../config/db.js";

export const getAllCategoryMenuTypes = async () => {
    //const [rows] = await db.query("SELECT * FROM Category_Menu_Type where ");
    const [rows] = await db.query("SELECT a.category_menu_type_Id, b.menu_type_name, c.category_name, a.item_limit FROM Category_Menu_Type a, menu_type b, category c where a.menu_type_id = b.menu_type_id and a.category_id = c.category_id");
    return rows;
};

export const getCategoryMenuTypeById = async (category_menu_type_Id) => {
    const [rows] = await db.query(
        "SELECT * FROM Category_Menu_Type WHERE category_menu_type_Id = ?",
        [category_menu_type_Id]
    );
    return rows[0];
};

export const createCategoryMenuType = async (menu_type_id, category_id, item_limit) => {
    const [result] = await db.query(
        "INSERT INTO Category_Menu_Type (menu_type_id, category_id, item_limit) VALUES (?, ?, ?)",
        [menu_type_id, category_id, item_limit]
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
