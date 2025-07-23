import db from '../config/db.js';

class saveSelectedServiceModel {
    static async saveSelectedServices(customerId, bookingId, serviceIds) {
        const conn = await db.getConnection();
        try {
            await conn.query('START TRANSACTION');
            
            // Delete existing selections for this booking
            await conn.query(
                'DELETE FROM Customer_Event_Service WHERE booking_id = ?',
                [bookingId]
            );
            
            // Insert new selections
            if (serviceIds.length > 0) {
                const values = serviceIds.map(serviceId => [
                    customerId,
                    bookingId,
                    serviceId
                ]);
                
                await conn.query(
                    `INSERT INTO Customer_Event_Service 
                    (customer_id, booking_id, event_service_id) 
                    VALUES ?`,
                    [values]
                );
            }
            
            await conn.query('COMMIT');
            return true;
        } catch (error) {
            await conn.query('ROLLBACK');
            console.error('Database Error:', error);
            throw new Error('Failed to save services');
        }
        finally {
            conn.release();
        }
    }
}

export default saveSelectedServiceModel;