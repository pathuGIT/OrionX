// models/eventServiceModel.js
import db from '../config/db.js';

class EventServiceModel {
    static async getEventServices() {
        try {
            const [results] = await db.query(`
                SELECT 
                    Event_Service_ID AS id,
                    Event_Service_Name AS name,
                    image_path AS imagePath
                FROM event_service
                ORDER BY Event_Service_Name
            `);
            return results;
        } catch (error) {
            console.error("Database Error (getEventServices):", error);
            throw new Error("Failed to fetch event services");
        }
    }
}

export default EventServiceModel;