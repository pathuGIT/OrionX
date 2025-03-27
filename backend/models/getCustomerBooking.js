import db from '../config/db.js';

class getCustomerBooking {
    static async getCustomerBooking({ customerID }) {
        try {
            const [result] = await db.query(
                `SELECT booking_id, customer_id, booking_date FROM booking WHERE customer_id = ?`, 
                [customerID] // Pass as an array
            );

            return result;
        } catch (error) {
            console.error("Database Error (getCustomerBooking):", error);
            throw new Error("Failed to get customer booking.");
        }
    }
}

export default getCustomerBooking;
