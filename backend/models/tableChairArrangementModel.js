import db from '../config/db.js';
import { EventLinkModel } from './eventTableChairModel.js';


export class TableChairArrangementModel {
    static async createOrUpdateArrangement(booking_id, arrangementData) {
        const connection = await db.getConnection();
        try {
            await connection.query('START TRANSACTION');

            // 1. Get event ID
            const [event] = await connection.query(
                `SELECT Event_ID FROM Event WHERE booking_id = ?`,
                [booking_id]
            );
            if (!event.length) throw new Error('Event not found');
            const eventId = event[0].Event_ID;

            // 2. Check for existing arrangement
            const [existing] = await connection.query(
                `SELECT Arrangement_Id FROM event_table_chair
                 WHERE Event_ID = ?`,
                [eventId]
            );

            let arrangementId;
            
            if (existing.length > 0) {
                // Update existing arrangement
                arrangementId = existing[0].Arrangement_Id;
                await connection.query(
                    `UPDATE table_chair_arrangement 
                     SET Head_Table_Pax = ?,
                         Top_Cloth_Color = ?,
                         Table_Cloth_Color = ?,
                         Bow_Color = ?,
                         Chair_Cover_Color = ?
                     WHERE Arrangement_ID = ?`,
                    [
                        arrangementData.headPax,
                        arrangementData.topClothColor,
                        arrangementData.tableClothColor,
                        arrangementData.bowColor,
                        arrangementData.chairCoverColor,
                        arrangementId
                    ]
                );
            } else {
                // Create new arrangement
                const [lastId] = await connection.query(
                    `SELECT Arrangement_ID FROM table_chair_arrangement 
                     ORDER BY Arrangement_ID DESC LIMIT 1`
                );

                let newIdNumber = lastId.length ? 
                    parseInt(lastId[0].Arrangement_ID.replace('TCA', '')) + 1 : 1;
                arrangementId = `TCA${String(newIdNumber).padStart(6, '0')}`;

                await connection.query(
                    `INSERT INTO table_chair_arrangement 
                    (Arrangement_ID, Head_Table_Pax, Top_Cloth_Color,
                     Table_Cloth_Color, Bow_Color, Chair_Cover_Color)
                    VALUES (?, ?, ?, ?, ?, ?)`,
                    [
                        arrangementId,
                        arrangementData.headPax,
                        arrangementData.topClothColor,
                        arrangementData.tableClothColor,
                        arrangementData.bowColor,
                        arrangementData.chairCoverColor
                    ]
                );

                await EventLinkModel.linkArrangement(eventId, arrangementId);
            }

            await connection.query('COMMIT');
            return arrangementId;

        } catch (error) {
            await connection.query('ROLLBACK');
            console.error("Database Error:", error.message);
            throw error;
        } finally {
            connection.release();
        }
    }

    static async createReservation(booking_id, tableData) {
        let connection;
        try {
            connection = await db.getConnection();
            await connection.query('START TRANSACTION');

            // Get event ID
            const [event] = await connection.query(
                `SELECT Event_ID FROM Event WHERE booking_id = ?`,
                [booking_id]
            );
            const newEventID = event[0].Event_ID;

            const [event_table_chair] = await connection.query(
                `SELECT Arrangement_Id FROM event_table_chair WHERE Event_ID = ?`,
                [newEventID]
            );

            const NewArrangement_Id = event_table_chair[0].Arrangement_Id;



            // Check existing table number
            const [existing] = await connection.query(
                `SELECT tr.Table_Number 
                FROM table_reserve tr
                JOIN table_chair_arrangement tca ON tr.Table_Reserve_ID = tca.Table_Reserve_ID
                JOIN event_table_chair etc ON tca.Arrangement_ID = etc.Arrangement_Id
                WHERE etc.Event_ID = ? AND tr.Table_Number = ?`,
                [newEventID, tableData.tableNumber]
            );

            if (existing.length > 0) {
                throw new Error('Table number already exists for this event');
            }

            // Generate new TAB ID
            const [lastId] = await connection.query(
                `SELECT Table_Reserve_ID 
                FROM table_reserve 
                ORDER BY Table_Reserve_ID DESC 
                LIMIT 1`
            );

            let newIdNumber = 1;
            if (lastId.length > 0) {
                const lastIdString = lastId[0].Table_Reserve_ID.replace('TAB', '');
                newIdNumber = parseInt(lastIdString, 10) + 1;
            }
            const newReservationId = `TAB${newIdNumber.toString().padStart(6, '0')}`;

            // Create reservation with generated ID
            await connection.query(
                `INSERT INTO table_reserve 
                (Table_Reserve_ID, Table_Number, Reserve_Name)
                VALUES (?, ?, ?)`,
                [newReservationId, tableData.tableNumber, tableData.reserveName]
            );

            // Link reservation to arrangement
            
            await connection.query(
                `INSERT INTO arrangement_reservation 
                (Arrangement_ID, Table_Reserve_ID)
                VALUES (?, ?)`,
                [NewArrangement_Id, newReservationId]
            );



            await connection.query('COMMIT');
            return newReservationId;

        } catch (error) {
            await connection.query('ROLLBACK');
            console.error("Database Error (createReservation):", error.message);
            throw new Error(error.message || "Failed to create table reservation");
        } finally {
            if (connection) connection.release();
        }
    }

}

export default TableChairArrangementModel;