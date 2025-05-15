import db from "../config/db.js";

export const getAllSelections = async () => {
    const [rows] = await db.query("SELECT * FROM Customer_Menu_Item_Selection");
    return rows;
};

export const getSelectionById = async (booking_id, ICMT_Id) => {
    const [rows] = await db.query(
        "SELECT * FROM Customer_Menu_Item_Selection WHERE booking_id = ? AND ICMT_Id = ?",
        [booking_id, ICMT_Id]
    );
    return rows[0];
};

export const createSelection = async (booking_id, ICMT_Id) => {
    const [result] = await db.query(
        "INSERT INTO Customer_Menu_Item_Selection (booking_id, ICMT_Id) VALUES (?, ?)",
        [booking_id, ICMT_Id]
    );
    return result.insertId;
};

export const deleteSelection = async (booking_id, ICMT_Id) => {
    const [result] = await db.query(
        "DELETE FROM Customer_Menu_Item_Selection WHERE booking_id = ? AND ICMT_Id = ?",
        [booking_id, ICMT_Id]
    );
    return result.affectedRows;
};

export const existsBookingSelection = async (booking_id) => {
    console.log("Checking booking selection for ID:", booking_id);
    const [rows] = await db.query(
        "SELECT 1 FROM Customer_Menu_Item_Selection WHERE booking_id = ? LIMIT 1",
        [booking_id]
    );
    return rows.length > 0;
};

export default {
    getAllSelections,
    getSelectionById,
    createSelection,
    deleteSelection,
    existsBookingSelection
};
