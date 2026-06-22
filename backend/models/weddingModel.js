import db from '../config/db.js';

class Wedding {
    static async createWedding(weddingData) {
        const conn = await db.getConnection();
            // Insert into Event table and retrieve Event_ID
            const [eventResult] = await conn.query(
                `INSERT INTO Event 
                (Buffet_TimeFrom, Buffet_TimeTo, Function_durationFrom, Function_durationTo, 
                Tea_table_Time, Dress_Time, booking_id) 
                VALUES (?, ?, ?, ?, ?, ?, ?)`,

                [
                    weddingData.buffetTimeFrom, 
                    weddingData.buffetTimeTo, 
                    weddingData.functionDurationFrom, 
                    weddingData.functionDurationTo, 
                    weddingData.teaTableTime, 
                    weddingData.dressTime, 
                    weddingData.bookingID
                ]
            );

             const [NewEventID] = await conn.query(
                `SELECT Event_ID FROM Event WHERE booking_id = ?`,
                [weddingData.bookingID]
            );
            let newEventID = NewEventID[0].Event_ID;

            // Insert into Wedding table using the correct Event_ID
            await conn.query(
                `INSERT INTO Wedding 
                (Event_ID, Groom_Name, Bride_Name, Groom_Contact_no, Bride_Contact_no, Fountain, ProsperityTable, 
                Groom_Address, Bride_Address, Poruwa_CeremonyFrom, Poruwa_CeremonyTo, Registration_Time) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,

                [
                    newEventID,
                    weddingData.groomName, 
                    weddingData.brideName, 
                    weddingData.groomContact, 
                    weddingData.brideContact, 
                    weddingData.fountain, 
                    weddingData.prosperityTable, 
                    weddingData.groomAddress, 
                    weddingData.brideAddress, 
                    weddingData.ceremonyFrom, 
                    weddingData.ceremonyTo, 
                    weddingData.registrationTime
                ]
            );
            conn.release();
            console.log("Wedding inserted successfully with Event_ID:", newEventID);
            return newEventID;
        } catch (error) {
            console.error("Database Error (createWedding):", error.message || error);
            throw new Error(error.message || "Failed to create wedding event.");
            
        
    }
}

export default Wedding;
