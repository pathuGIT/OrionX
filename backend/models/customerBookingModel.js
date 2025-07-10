import db from '../config/db.js';

class customerBookingModel {
    static async getCustomerBooking(customerID) {
        try {
            const [result] = await db.query(
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
        }
    }
}

export default customerBookingModel;
