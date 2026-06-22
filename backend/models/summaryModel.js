import db from "../config/db.js";

// Get summary for a specific booking_id
export const getSummaryByBookingId = async (booking_id) => {
    const conn = await db.getConnection();
        const [rows] = await conn.query(`
            SELECT 
                booking_id,
                category_name,
                GROUP_CONCAT(item_name SEPARATOR ', ') AS items,
                COUNT(item_name) AS total_items
            FROM view_customer_menu_item_selection
            WHERE booking_id = ?
            GROUP BY category_name, booking_id
        `, [booking_id]);

        conn.release(); // Always release the connection

    return rows;
};

export default {
    getSummaryByBookingId
};
