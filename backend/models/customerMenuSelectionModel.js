import db from "../config/db.js";

export const getAllSelections = async () => {
    const [rows] = await db.query("SELECT * FROM Customer_Menu_Item_Selection");
    return rows;
};

export const getSelectionById = async (customer_id, ICMT_Id) => {
    const [rows] = await db.query(
        "SELECT * FROM Customer_Menu_Item_Selection WHERE customer_id = ? AND ICMT_Id = ?",
        [customer_id, ICMT_Id]
    );
    return rows[0];
};

export const createSelection = async (customer_id, ICMT_Id) => {
    const [result] = await db.query(
        "INSERT INTO Customer_Menu_Item_Selection (customer_id, ICMT_Id) VALUES (?, ?)",
        [customer_id, ICMT_Id]
    );
    return result.insertId;
};

export const deleteSelection = async (customer_id, ICMT_Id) => {
    const [result] = await db.query(
        "DELETE FROM Customer_Menu_Item_Selection WHERE customer_id = ? AND ICMT_Id = ?",
        [customer_id, ICMT_Id]
    );
    return result.affectedRows;
};

export default {
    getAllSelections,
    getSelectionById,
    createSelection,
    deleteSelection
};
