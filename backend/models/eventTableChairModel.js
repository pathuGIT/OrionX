import db from '../config/db.js';

export class EventLinkModel {
    static async getAllDesigns() {
        let connection;
        try {
            connection = await db.getConnection();
            const [designs] = await connection.query('SELECT * FROM tables_and_chairs');
            return designs;
        } catch (error) {
            console.error('Error fetching table designs:', error);
            throw error;
        } finally {
            if (connection) connection.release();
        }
    }

    static async getArrangementsByBooking(bookingid) {
        const connection = await db.getConnection();
        try {
            const [results] = await connection.query(`
                SELECT 
                    tca.Arrangement_ID,
                    tca.Head_Table_Pax,
                    tca.Top_Cloth_Color,
                    tca.Table_Cloth_Color,
                    tca.Bow_Color,
                    tca.Chair_Cover_Color,
                    tr.Table_Reserve_ID,
                    tr.Table_Number,
                    tr.Reserve_Name
                FROM Event e
                JOIN event_table_chair etc ON e.Event_ID = etc.Event_ID
                JOIN table_chair_arrangement tca ON etc.Arrangement_Id = tca.Arrangement_ID
                LEFT JOIN arrangement_reservation ar ON tca.Arrangement_ID = ar.Arrangement_ID
                LEFT JOIN table_reserve tr ON ar.Table_Reserve_ID = tr.Table_Reserve_ID
                WHERE e.booking_id = ?
            `, [bookingid]);

            // Group reservations per arrangement
            const arrangementsMap = new Map();

            results.forEach(row => {
                if (!arrangementsMap.has(row.Arrangement_ID)) {
                    arrangementsMap.set(row.Arrangement_ID, {
                        ...row,
                        Reservations: []
                    });
                }
                if (row.Table_Reserve_ID) {
                    arrangementsMap.get(row.Arrangement_ID).Reservations.push({
                        Table_Reserve_ID: row.Table_Reserve_ID,
                        Table_Number: row.Table_Number,
                        Reserve_Name: row.Reserve_Name
                    });
                }
            });

            return Array.from(arrangementsMap.values());
        } catch (error) {
            console.error("Database Error:", error.message);
            throw new Error("Failed to get arrangements");
        } finally {
            connection.release();
        }
    }
}

export default EventLinkModel;//