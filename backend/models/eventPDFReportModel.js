// eventPDFReportModel.js
import db from '../config/db.js';

class ReportModel {
    static async getReportData(bookingId) {
        const query = `
            SELECT
                -- Booking & Customer
                b.booking_id, b.booking_date, b.number_of_guests, b.time_slot,
                c.name AS customer_name,
                
                -- Event
                e.Event_ID, e.Buffet_TimeFrom, e.Buffet_TimeTo, 
                e.Function_durationFrom, e.Function_durationTo, 
                e.Additional_Time, e.Dress_Time, e.Tea_table_Time,

                -- Wedding Specifics
                w.Groom_Name, w.Bride_Name, w.Groom_Contact_no, w.Bride_Contact_no, 
                w.Registration_Time, w.Poruwa_CeremonyFrom, w.Poruwa_CeremonyTo, 
                w.ProsperityTable, w.Fountain,
                
                -- Custom Event Specifics
                ce.Event_Name AS custom_event_name, 
                ce.ContactPersonName, ce.ContactPersonNumber,

                -- Table Arrangements
                tca.Head_Table_Pax, tca.Top_Cloth_Color, 
                tca.Table_Cloth_Color, tca.Bow_Color, tca.Chair_Cover_Color,
                
                -- Bar Details
                bar.LiquorTimeFrom, bar.LiquorTimeTo, bar.BarPax,
                
                -- Coordinators
                (SELECT GROUP_CONCAT(co.Cordinator_Name SEPARATOR ', ')
                 FROM event_cordinator ec
                 JOIN cordinator co ON ec.Cordinator_Name = co.Cordinator_Name
                 WHERE ec.Event_ID = e.Event_ID) AS coordinators,

                -- Selected Services
                    (SELECT GROUP_CONCAT(es.Event_Service_Name SEPARATOR ', ') 
                FROM customer_event_service ces
                JOIN event_service es ON ces.event_service_id = es.Event_Service_ID
                WHERE ces.booking_id = b.booking_id) AS selected_services,
                 
                -- Selected Bites
                (SELECT JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'name', mt.menu_type_name, 
                        'quantity', bite.Quantity
                    )
                 )
                 FROM bite
                 JOIN menu_type mt ON bite.menu_type_id = mt.menu_type_id
                 WHERE bite.BarRequirementID = bar.BarRequirementID) AS selected_bites,

                -- Soft Drinks
                (SELECT JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'name', sdi.Soft_Drink_name, 
                        'quantity', sdi.quantity
                    )
                 )
                 FROM soft_drink_items sdi 
                 WHERE sdi.BarRequirementID = bar.BarRequirementID) AS soft_drink_items

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

// Controller for admin bookings report
static async getAllBookingReports() {
        const query = `
            SELECT 
                b.booking_id,
                b.booking_date,
                c.name AS customer_name,
                c.email,
                c.phone,
                e.Event_ID,
                CASE 
                    WHEN w.Event_ID IS NOT NULL THEN 'wedding'
                    WHEN ce.Event_ID IS NOT NULL THEN 'custom'
                    ELSE 'No Event Details'
                END AS event_type,
                w.Groom_Name,
                w.Bride_Name,
                ce.Event_Name,
                ce.ContactPersonName
            FROM booking b
            JOIN customer c ON b.customer_id = c.customer_id
            LEFT JOIN event e ON b.booking_id = e.booking_id
            LEFT JOIN wedding w ON e.Event_ID = w.Event_ID
            LEFT JOIN customevent ce ON e.Event_ID = ce.Event_ID
            ORDER BY b.booking_date DESC
        `;

        try {
            const [results] = await db.query(query);
            return results;
        } catch (error) {
            console.error('Database query error:', error);
            
            // Enhance error information
            error.details = {
                query,
                timestamp: new Date().toISOString()
            };
            
            throw error;
        }
    }







}

export default ReportModel;