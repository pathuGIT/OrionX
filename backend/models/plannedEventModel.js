import db from "../config/db.js";

class plannedEvent {
    static async getPlannedEvent(customerID, bookingID) {
        try {
            // Add b.booking_id = ? to the WHERE clause
            const [results] = await db.query(
                `SELECT 
                    e.Event_ID, 
                    e.Buffet_TimeFrom, 
                    e.Buffet_TimeTo, 
                    e.Additional_Time, 
                    e.Function_durationFrom, 
                    e.Function_durationTo, 
                    e.Tea_table_Time, 
                    e.Dress_Time, 
                    w.Groom_Name, 
                    w.Bride_Name, 
                    w.Groom_Contact_no, 
                    w.Bride_Contact_no, 
                    w.Fountain, 
                    w.ProsperityTable, 
                    w.Poruwa_CeremonyFrom, 
                    w.Poruwa_CeremonyTo, 
                    w.Registration_Time, 
                    w.Groom_Address,
                    w.Bride_Address,
                    c.Event_Name AS Custom_Event_Name, 
                    c.ContactPersonName, 
                    c.ContactPersonNumber
                FROM booking b
                LEFT JOIN event e ON b.booking_id = e.booking_id
                LEFT JOIN wedding w ON e.Event_ID = w.Event_ID
                LEFT JOIN customevent c ON e.Event_ID = c.Event_ID
                WHERE b.customer_id = ? AND b.booking_id = ?`,
                [customerID, bookingID] // Pass both IDs as parameters
            );

            return results;
        } catch (error) {
            console.error("Database Error:", error);
            throw new Error("Failed to fetch event details.");
        }
    }
static async update(eventId, eventData) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Determine event type
      const [eventType] = await connection.query(
        `SELECT 
          (SELECT COUNT(*) FROM wedding WHERE Event_ID = ?) AS isWedding,
          (SELECT COUNT(*) FROM customevent WHERE Event_ID = ?) AS isCustom`,
        [eventId, eventId]
      );

      const { isWedding, isCustom } = eventType[0];

      // Update base event table
      await connection.query(
        `UPDATE event SET
          Buffet_TimeFrom = ?,
          Buffet_TimeTo = ?,
          Function_durationFrom = ?,
          Function_durationTo = ?,
          Tea_table_Time = ?,
          Dress_Time = ?
        WHERE Event_ID = ?`,
        [
          eventData.Buffet_TimeFrom,
          eventData.Buffet_TimeTo,
          eventData.Function_durationFrom,
          eventData.Function_durationTo,
          eventData.Tea_table_Time,
          eventData.Dress_Time,
          eventId
        ]
      );

      // Update wedding-specific fields
      if (isWedding) {
        await connection.query(
          `UPDATE wedding SET
            Groom_Name = ?,
            Bride_Name = ?,
            Groom_Contact_no = ?,
            Bride_Contact_no = ?,
            Poruwa_CeremonyFrom = ?,
            Poruwa_CeremonyTo = ?,
            Registration_Time = ?,
            Fountain = ?,
            ProsperityTable = ?,
            Groom_Address = ?,
            Bride_Address = ?
          WHERE Event_ID = ?`,
          [
            eventData.Groom_Name || null,
            eventData.Bride_Name || null,
            eventData.Groom_Contact_no || null,
            eventData.Bride_Contact_no || null,
            eventData.Poruwa_CeremonyFrom || null,
            eventData.Poruwa_CeremonyTo || null,
            eventData.Registration_Time || null,
            eventData.Fountain || 'no',
            eventData.ProsperityTable || 'no',
            eventData.Groom_Address || null,
            eventData.Bride_Address || null,
            eventId
          ]
        );
      }

      // Update custom event-specific fields
      if (isCustom) {
        await connection.query(
          `UPDATE customevent SET
            Event_Name = ?,
            ContactPersonName = ?,
            ContactPersonNumber = ?
          WHERE Event_ID = ?`,
          [
            eventData.Custom_Event_Name || null,
            eventData.ContactPersonName || null,
            eventData.ContactPersonNumber || null,
            eventId
          ]
        );
      }

      await connection.commit();

      // Fetch updated event data
      const [updated] = await connection.query(
        `SELECT e.*, w.*, c.*
         FROM event e
         LEFT JOIN wedding w ON e.Event_ID = w.Event_ID
         LEFT JOIN customevent c ON e.Event_ID = c.Event_ID
         WHERE e.Event_ID = ?`,
        [eventId]
      );
      
      return updated[0];

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }



    // Delete event and type-specific details
    static async delete(eventId) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // 1. Get all associated IDs from the Event table first.
            const [eventRows] = await connection.query(
                'SELECT booking_id, BarRequirementID FROM Event WHERE Event_ID = ?',
                [eventId]
            );

            if (eventRows.length === 0) {
                await connection.commit();
                console.log(`Event with ID ${eventId} not found. Nothing to delete.`);
                return true;
            }

            const { booking_id, BarRequirementID } = eventRows[0];



            // 3. Clean up Table Arrangement data (if it exists).
            // This is a deep chain of dependencies that must be deleted from the inside out.
            const [tableChairRows] = await connection.query(
                'SELECT Arrangement_Id FROM event_table_chair WHERE Event_ID = ?',
                [eventId]
            );

            if (tableChairRows.length > 0) {
                const { Arrangement_Id } = tableChairRows[0];
                // Delete from the junction table first.
                await connection.query('DELETE FROM arrangement_reservation WHERE Arrangement_ID = ?', [Arrangement_Id]);


                const [arrangementRows] = await connection.query(
                    'SELECT Table_Reserve_ID FROM table_chair_arrangement WHERE Arrangement_ID = ?',
                    [Arrangement_Id]
                );
                if (arrangementRows.length > 0 && arrangementRows[0].Table_Reserve_ID) {
                    const { Table_Reserve_ID } = arrangementRows[0];
                    await connection.query('DELETE FROM table_reserve WHERE Table_Reserve_ID = ?', [Table_Reserve_ID]);
                }
                // Now delete the arrangement and the event's link to it.
                await connection.query('DELETE FROM table_chair_arrangement WHERE Arrangement_ID = ?', [Arrangement_Id]);
                await connection.query('DELETE FROM event_table_chair WHERE Event_ID = ?', [eventId]);
            }

            await connection.query('DELETE FROM event_cordinator WHERE Event_ID = ?', [eventId]);
            await connection.query('DELETE FROM event_assigned_employee WHERE Event_ID = ?', [eventId]);
            await connection.query('DELETE FROM event_event_service WHERE Event_ID = ?', [eventId]);

            // 5. Clean up dependencies linked via booking_id.
            if (booking_id) {
                await connection.query('DELETE FROM customer_event_service WHERE booking_id = ?', [booking_id]);
            }

            await connection.query('DELETE FROM Wedding WHERE Event_ID = ?', [eventId]);
            await connection.query('DELETE FROM CustomEvent WHERE Event_ID = ?', [eventId]);

            // 2. Clean up Bar-related data (if it exists).
            // These tables are referenced by the Bar table.
            if (BarRequirementID) {
                await connection.query('DELETE FROM Bite WHERE BarRequirementID = ?', [BarRequirementID]);
                await connection.query('DELETE FROM liquor_items WHERE BarRequirementID = ?', [BarRequirementID]);
                await connection.query('DELETE FROM soft_drink_items WHERE BarRequirementID = ?', [BarRequirementID]);
                // Now delete the Bar record itself.
            }
            await connection.query('DELETE FROM Bar WHERE BarRequirementID = ?', [BarRequirementID]);
            // 4. Clean up other direct event dependencies.
            // These tables all have a foreign key pointing directly to the Event table.
            // They MUST be cleared before deleting the event.



            // 6. FINALLY: Now that all child records are gone, delete the master Event record.

            await connection.query('DELETE FROM Event WHERE Event_ID = ?', [eventId]);
            // Note: We are not deleting the booking or customer itself, as they might be related to other records.

            await connection.commit();
            console.log(`Successfully deleted event ${eventId} and all related data.`);
            return true;

        } catch (error) {
            await connection.rollback();
            console.error(`Error deleting event ${eventId}:`, error);
            throw error;
        } finally {
            connection.release();
        }
    }









}

export default plannedEvent;
