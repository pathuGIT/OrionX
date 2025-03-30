// import db from '../config/db.js';

// class customerPlannedEventModel {
//     static async getCustomerPlannedEvent(customerID) {
//         try {
//             const [rows] = await db.query(
//                 `SELECT Event_ID, Buffet_TimeFrom, Buffet_TimeTo, 
//                 Function_durationFrom, Function_durationTo, Tea_table_Time, Dress_Time, booking_id 
//                 FROM Event WHERE booking_id = ?`, [customerID]
//             );
//             return rows;
//         } catch (error) {
//             console.error("Database Error (getCustomerPlannedEvent):", error);
//             throw new Error("Failed to fetch customer planned events.");
//         }
//     }
// }
// export default customerPlannedEventModel;
    

