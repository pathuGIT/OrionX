import db from '../config/db.js';

class serviceVendorModel {
    static async getVendorsByCustomerBooking(customerId, bookingId) {
        try {
            const [results] = await db.query(`
                SELECT DISTINCT v.Vendor_ID, v.Contact_no, v.Email, v.Address
                FROM Customer_Event_Service ces
                JOIN event_service_vendor esv ON ces.event_service_id = esv.event_service_id
                JOIN vendor v ON esv.vendor_id = v.Vendor_ID
                WHERE ces.customer_id = ? AND ces.booking_id = ?
            `, [customerId, bookingId]);

            return results;
        } catch (error) {
            console.error("Database Error (getVendorsByCustomerBooking):", error);
            throw new Error("Failed to fetch vendors");
        }
    }
}

export default serviceVendorModel;