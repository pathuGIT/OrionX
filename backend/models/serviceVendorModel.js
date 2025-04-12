import db from '../config/db.js';

class ServiceVendorModel {
    static async getServiceVendors() {
        try {
            const [results] = await db.query(`
                SELECT 
                    es.Event_Service_ID AS serviceId,
                    es.Event_Service_Name AS serviceName,
                    v.Vendor_ID AS vendorId,
                    v.Contact_no AS contact,
                    v.Email AS email,
                    v.Address AS address
                FROM event_service es
                JOIN event_service_vendor esv ON es.Event_Service_ID = esv.event_service_id
                JOIN vendor v ON esv.vendor_id = v.Vendor_ID
                ORDER BY es.Event_Service_Name, v.Vendor_ID
            `);
            return results;
        } catch (error) {
            console.error("Database Error (getServiceVendors):", error.message || error);
            throw new Error(error.message || "Failed to fetch service vendors");
        }
    }
}

export default ServiceVendorModel;