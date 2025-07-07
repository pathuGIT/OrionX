import db from '../config/db.js';

class customerBookingModel {
    static async getCustomerBooking(customerID) {
        try {
            const [result] = await db.query(
                `SELECT booking_id, customer_id, booking_date FROM booking WHERE customer_id = ? AND (status = 'confirmed' OR status = 'done')`, 
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
