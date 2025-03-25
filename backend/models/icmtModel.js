import db from "../config/db.js";

// Get all records from Item_Category_Menu_Type
export const getAllICMT = async () => {
    const [rows] = await db.query("SELECT * FROM Item_Category_Menu_Type");
    return rows;
};

// Get a single record by ICMT_Id
export const getICMTById = async (ICMT_Id) => {
    const [rows] = await db.query("SELECT * FROM Item_Category_Menu_Type WHERE ICMT_Id = ?", [ICMT_Id]);
    return rows[0];
};

// Create a new record in Item_Category_Menu_Type
export const createICMT = async (ICMT_Id, category_menu_type_id, item_id) => {
    const [result] = await db.query(
        "INSERT INTO Item_Category_Menu_Type (ICMT_Id, category_menu_type_id, item_id) VALUES (?, ?, ?)",
        [ICMT_Id, category_menu_type_id, item_id]
    );
    return result.insertId;
};

// Update a record in Item_Category_Menu_Type
export const updateICMT = async (ICMT_Id, category_menu_type_id, item_id) => {
    const [result] = await db.query(
        "UPDATE Item_Category_Menu_Type SET category_menu_type_id = ?, item_id = ? WHERE ICMT_Id = ?",
        [category_menu_type_id, item_id, ICMT_Id]
    );
    return result.affectedRows;
};

// Delete a record by ICMT_Id
export const deleteICMT = async (ICMT_Id) => {
    const [result] = await db.query("DELETE FROM Item_Category_Menu_Type WHERE ICMT_Id = ?", [ICMT_Id]);
    return result.affectedRows;
};

export default {
    getAllICMT,
    getICMTById,
    createICMT,
    updateICMT,
    deleteICMT
};
