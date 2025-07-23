import db from "../config/db.js";

export const getAllSelections = async () => {
    const conn = await db.getConnection();
    try {
        const [rows] = await conn.query("SELECT * FROM customer_menu_item_selection");
        return rows;
    } finally {
        conn.release();
    }
};

export const getSelectionById = async (booking_id, ICMT_Id) => {
    const conn = await db.getConnection();
    try {
        const [rows] = await conn.query(
            "SELECT * FROM customer_menu_item_selection WHERE booking_id = ? AND ICMT_Id = ?",
            [booking_id, ICMT_Id]
        );
        return rows[0];
    } finally {
        conn.release();
    }
};

export const createSelection = async (booking_id, ICMT_Id) => {
    const conn = await db.getConnection();
    try {
        const [result] = await conn.query(
            "INSERT INTO customer_menu_item_selection (booking_id, ICMT_Id) VALUES (?, ?)",
            [booking_id, ICMT_Id]
        );
        return result.insertId;
    } finally {
        conn.release();
    }
};

export const deleteSelection = async (booking_id, ICMT_Id) => {
    const conn = await db.getConnection();
    try {
        const [result] = await conn.query(
            "DELETE FROM customer_menu_item_selection WHERE booking_id = ? AND ICMT_Id = ?",
            [booking_id, ICMT_Id]
        );
        return result.affectedRows;
    } finally {
        conn.release();
    }
};

export const getCustomerMenuSelections = async (booking_id, ICMT_Id) => {
    const conn = await db.getConnection();
    try {
        const [result] = await conn.query(
            "select * from customer_menu_item_selection where booking_id = ?",
            [booking_id]
        );
        return result.affectedRows;
    } finally {
        conn.release();
    }
};

export const deleteAllMenuSelectionsForBooking = async (booking_id) => {
    const conn = await db.getConnection();
    console.log("Deleting all selections for booking ID:", booking_id);
    try {
        const [result] = await conn.query(
            "DELETE FROM customer_menu_item_selection WHERE booking_id = ?",
            [booking_id]
        );
        return result.affectedRows;
    } finally {
        conn.release();
    }
};

export const AdminDeleteMenuPriceFromBookingDetail = async (booking_id) => {
    const conn = await db.getConnection();
    try {
        const [result] = await conn.query(
            "UPDATE booking_pricing SET menu_price_total = 0.0 WHERE booking_id = ?",
            [booking_id]
        );
        return result.affectedRows;
    } finally {
        conn.release();
    }
};

export const existsBookingSelection = async (booking_id) => {
    const conn = await db.getConnection();
    try {
        const [rows] = await conn.query(
            "SELECT 1 FROM customer_menu_item_selection WHERE booking_id = ? LIMIT 1",
            [booking_id]
        );
        return rows.length > 0;
    } finally {
        conn.release();
    }
};

export default {
    getAllSelections,
    getSelectionById,
    createSelection,
    deleteSelection,
    existsBookingSelection,
    getCustomerMenuSelections,
    deleteAllMenuSelectionsForBooking,
    AdminDeleteMenuPriceFromBookingDetail
};
