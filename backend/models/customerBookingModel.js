import db from '../config/db.js';

class customerBookingModel {
    static async getCustomerBooking(customerID) {
        const conn = await db.getConnection();
        try {
            const [result] = await conn.query(
                `SELECT 
                    b.booking_id, 
                    b.booking_date, 
                    b.status, 
                    b.customer_id,
                    c.name AS customer_name 
                 FROM booking AS b
                 LEFT JOIN customer AS c ON b.customer_id = c.customer_id
                 WHERE b.customer_id = ? AND (b.status = 'confirmed' OR b.status = 'done')`,
                [customerID]
            );
            return result;
        } catch (error) {
            console.error("Database Error (getCustomerBooking):", error);
            throw new Error("Failed to get customer bookings.");
        } finally {
            conn.release();
        }
    }

    static async getTotalBookingEvents(customerID) {
        const conn = await db.getConnection();
        try {
            const [result] = await conn.query(
                `
                    SELECT
                         (
                            SELECT MIN(DATEDIFF(b2.booking_date, CURDATE()))
                            FROM booking AS b2
                            WHERE b2.customer_id = ?
                            AND (b2.status = 'confirmed' OR b2.status = 'done')
                            AND DATEDIFF(b2.booking_date, CURDATE()) >= 0
                        ) AS days_remaining,

                        SUM(CASE 
                            WHEN DATEDIFF(b.booking_date, CURDATE()) >= 0 THEN 1 
                            ELSE 0 
                        END) AS total_upcoming_bookings,

                        SUM(CASE 
                            WHEN DATEDIFF(b.booking_date, CURDATE()) < 0 THEN 1 
                            ELSE 0 
                        END) AS total_completed_bookings

                    FROM booking AS b
                    WHERE b.customer_id = ?
                    AND (b.status = 'confirmed' OR b.status = 'done')`,
                [customerID, customerID]
            );
            return result;
        } catch (error) {
            console.error("Database Error (getBookingEvents):", error);
            throw new Error("Failed to get booking events.");
        } finally {
            conn.release();
        }
    }



}

export default customerBookingModel;
