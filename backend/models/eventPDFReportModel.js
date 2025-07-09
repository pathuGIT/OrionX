import db from '../config/db.js';

class ReportModel {
    static async getReportData(bookingId) {
        const query = `
            SELECT
                b.booking_id, b.booking_date, b.number_of_guests, b.total_price,
                c.name AS customer_name, c.email AS customer_email, c.phone AS customer_phone,
                e.Event_ID, e.Event_name, e.Event_Type, e.Buffet_TimeFrom, e.Function_durationFrom, e.Function_durationTo,
                w.Groom_Name, w.Bride_Name,
                ce.ContactPersonName AS custom_event_contact,
                tca.Head_Table_Pax, tca.Top_Cloth_Color, tca.Table_Cloth_Color, tca.Bow_Color, tca.Chair_Cover_Color,
                bar.LiquorTimeFrom, bar.LiquorTimeTo, bar.BarPax,
                (SELECT GROUP_CONCAT(es.Event_Service_Name SEPARATOR ', ') 
                 FROM customer_event_service ces
                 JOIN event_service es ON ces.event_service_id = es.event_service_id
                 WHERE ces.booking_id = b.booking_id) AS selected_services,
                (SELECT GROUP_CONCAT(li.item_name, ' (Qty: ', li.quantity, ')' SEPARATOR '; ') 
                 FROM liquor_items li WHERE li.BarRequirementID = e.BarRequirementID) AS liquor_items,
                (SELECT GROUP_CONCAT(sdi.Soft_Drink_name, ' (Qty: ', sdi.quantity, ')' SEPARATOR '; ') 
                 FROM soft_drink_items sdi WHERE sdi.BarRequirementID = e.BarRequirementID) AS soft_drink_items
            FROM booking b
            JOIN customer c ON b.customer_id = c.customer_id
            LEFT JOIN event e ON b.booking_id = e.booking_id
            LEFT JOIN wedding w ON e.Event_ID = w.Event_ID
            LEFT JOIN customevent ce ON e.Event_ID = ce.Event_ID
            LEFT JOIN event_table_chair etc ON e.Event_ID = etc.Event_ID
            LEFT JOIN table_chair_arrangement tca ON etc.Arrangement_Id = tca.Arrangement_ID
            LEFT JOIN bar ON e.BarRequirementID = bar.BarRequirementID
            WHERE b.booking_id = ?;
        `;
        try {
            const [rows] = await db.query(query, [bookingId]);
            return rows[0] || null;
        } catch (error) {
            console.error("Error fetching report data:", error);
            throw new Error("Database query for report failed.");
        }
    }
}

export default ReportModel;
