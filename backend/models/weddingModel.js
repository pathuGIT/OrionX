import db from '../config/db.js';

class Wedding {
    static async createWedding(weddingData) {
        try {
            const [newEvent] = await db.query(
                `INSERT INTO Event (Buffet_TimeFrom, Buffet_TimeTo, 
                Function_durationFrom, Function_durationTo, Tea_table_Time, Dress_Time, booking_id) 
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
            console.log("New Event inserted with ID:", weddingData.buffetTimeFrom);
            // Check if an event already exists for the booking
            const [eventResult1] = await db.query(
                `SELECT Event_ID FROM Event WHERE booking_id = ?`, 
                [weddingData.bookingID]
            );

            
            if (eventResult1.length === 0) {
                console.log("No existing Event_ID found, inserting new Event...");
    
            } 
              const  eventID = eventResult1[0].Event_ID;
            

            console.log("Event ID to be used:", eventID);

            // Insert Wedding details
            const [weddingResult] = await db.query(
                `INSERT INTO Wedding 
                (Event_ID, Groom_Name, Bride_Name, Groom_Contact_no, Bride_Contact_no, Fountain, ProsperityTable, Groom_Address, Bride_Address, Poruwa_CeremonyFrom, Poruwa_CeremonyTo, Registration_Time) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    eventID,
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
            console.log("New Event inserted with ID:", weddingData.groomName);
            console.log("Wedding inserted successfully, ID:", weddingResult.insertId);
            return weddingResult.insertId;
        } catch (error) {
            console.error("Database Error (createWedding):", error);
            throw new Error("Failed to create wedding event.");
        }
    }
}

export default Wedding;
