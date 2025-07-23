import db from "../config/db.js";

// Get all records from Item_Category_Menu_Type
export const getItemCategoryMenuTypes  = async () => {
    const conn = await db.getConnection();
    const [rows] = await conn.query("SELECT * FROM Item_Category_Menu_Type");
    conn.release(); // Always release the connection
    return rows;
};

// Get a single record by ICMT_Id
export const getItemCategoryMenuTypeById  = async (ICMT_Id) => {
    const conn = await db.getConnection();
    const [rows] = await conn.query("SELECT * FROM Item_Category_Menu_Type WHERE ICMT_Id = ?", [ICMT_Id]);
    conn.release(); // Always release the connection
    return rows[0];
};

// Create a new record in Item_Category_Menu_Type
export const createItemCategoryMenuType = async (category_menu_type_id, item_id) => {
    const conn = await db.getConnection();
    const [result] = await conn.query(
        "INSERT INTO Item_Category_Menu_Type (category_menu_type_id, item_id) VALUES (?, ?)",
        [category_menu_type_id, item_id]
    );
    conn.release(); // Always release the connection
    return result.insertId;
};

// Update a record in Item_Category_Menu_Type
export const updateItemCategoryMenuType = async (ICMT_Id, category_menu_type_id, item_id) => {
    const conn = await db.getConnection();
    const [result] = await conn.query(
        "UPDATE Item_Category_Menu_Type SET category_menu_type_id = ?, item_id = ? WHERE ICMT_Id = ?",
        [category_menu_type_id, item_id, ICMT_Id]
    );
    conn.release(); // Always release the connection
    return result.affectedRows;
};

// Delete a record by ICMT_Id
export const deleteItemCategoryMenuType = async (ICMT_Id) => {
    const conn = await db.getConnection();
    const [result] = await conn.query("DELETE FROM Item_Category_Menu_Type WHERE ICMT_Id = ?", [ICMT_Id]);
    conn.release(); // Always release the connection
    return result.affectedRows;
};

export default {
    getItemCategoryMenuTypes ,
    getItemCategoryMenuTypeById,
    createItemCategoryMenuType,
    updateItemCategoryMenuType,
    deleteItemCategoryMenuType
};
