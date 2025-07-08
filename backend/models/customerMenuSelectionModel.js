import db from "../config/db.js";

export const getAllSelections = async () => {
    const [rows] = await db.query("SELECT * FROM customer_menu_item_selection");
    return rows;
};

export const getSelectionById = async (booking_id, ICMT_Id) => {
    const [rows] = await db.query(
        "SELECT * FROM customer_menu_item_selection WHERE customer_id = ? AND ICMT_Id = ?",
        [booking_id, ICMT_Id]
    );
    return rows[0];
};

export const createSelection = async (booking_id, ICMT_Id) => {
    const [result] = await db.query(
        "INSERT INTO customer_menu_item_selection (customer_id, ICMT_Id) VALUES (?, ?)",
        [booking_id, ICMT_Id]
    );
    return result.insertId;
};

export const deleteSelection = async (booking_id, ICMT_Id) => {
    const [result] = await db.query(
        "DELETE FROM customer_menu_item_selection WHERE customer_id = ? AND ICMT_Id = ?",
        [booking_id, ICMT_Id]
    );
    return result.affectedRows;
};

export const existsBookingSelection = async (booking_id) => {
    console.log("Checking booking selection for ID:", booking_id);
    const [rows] = await db.query(
        "SELECT 1 FROM customer_menu_item_selection WHERE customer_id = ? LIMIT 1",
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
