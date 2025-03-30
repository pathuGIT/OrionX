import db from '../config/db.js';

class Wedding {
    static async createWedding(weddingData) {
        try {
            console.log("Inserting wedding data:", weddingData); // Log weddingData for debugging
            const [result] = await db.query(
                `INSERT INTO Wedding 
                (Groom_Name, Bride_Name, Groom_Contact_no, Bride_Contact_no, Fountain, ProsperityTable, Groom_Address, Bride_Address, Poruwa_CeremonyFrom, Poruwa_CeremonyTo, Registration_Time) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
                [
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
            console.log("Wedding inserted successfully, ID:", result.insertId); // Log result
            return result.insertId;
        } catch (error) {
            console.error("Database Error (createWedding):", error); // Log error
            throw new Error("Failed to create wedding event.");
        }
    }
}

export default Wedding;
