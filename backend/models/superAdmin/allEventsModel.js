// models/CombinedEvent.js
import db from '../../config/db.js';

class AllEvent {
  // // Create event with type-specific details
  // static async create(eventType, data) {
  //   const connection = await db.getConnection();
  //   try {
  //     await connection.beginTransaction();

  //     // Create base event
  //     const [eventResult] = await connection.query(
  //       'INSERT INTO Event SET ?',
  //       [{
  //         Event_Type: eventType,
  //         Event_Date: data.eventDate,
  //         Status: 'active',
  //         // Add other common fields
  //       }]
  //     );
  //     const eventId = eventResult.insertId;

  //     // Create type-specific record
  //     let typeTable, typeData;
  //     switch(eventType) {
  //       case 'wedding':
  //         typeTable = 'Wedding';
  //         typeData = {
  //           Event_ID: eventId,
  //           Groom_Name: data.groomName,
  //           Bride_Name: data.brideName,
  //           Groom_Contact: data.groomContact,
  //           Bride_Contact: data.brideContact,
  //           Poruwa_Time: data.poruwaTime
  //         };
  //         break;
  //       case 'custom':
  //         typeTable = 'CustomEvent';
  //         typeData = {
  //           Event_ID: eventId,
  //           Event_Name: data.eventName,
  //           Contact_Person: data.contactPerson,
  //           Contact_Number: data.contactNumber,
  //           Special_Requirements: data.specialRequirements
  //         };
  //         break;
  //       default:
  //         throw new Error('Invalid event type');
  //     }

  //     const [typeResult] = await connection.query(
  //       `INSERT INTO ${typeTable} SET ?`,
  //       [typeData]
  //     );

  //     await connection.commit();
  //     return { eventId, typeId: typeResult.insertId };

  //   } catch (error) {
  //     await connection.rollback();
  //     throw error;
  //   } finally {
  //     connection.release();
  //   }
  // }

  // Update event and type-specific details

static async update(eventId, eventData) {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // Ensure eventType is properly extracted
    const eventType = eventData.Event_Type || 'wedding'; // Default to wedding

    // Update base event table
    await connection.query(
      `UPDATE Event SET
        Buffet_TimeFrom = ?,
        Buffet_TimeTo = ?,
        Additional_Time = ?,
        Function_durationFrom = ?,
        Function_durationTo = ?,
        Tea_table_Time = ?,
        Dress_Time = ?
       WHERE Event_ID = ?`,
      [
        eventData.Buffet_TimeFrom || null,
        eventData.Buffet_TimeTo || null,
        eventData.Additional_Time || null,
        eventData.Function_durationFrom || null,
        eventData.Function_durationTo || null,
        eventData.Tea_table_Time || null,
        eventData.Dress_Time || null,
        eventId
      ]
    );

    // Conditionally update type-specific table
    if (eventType === 'wedding') {
      await connection.query(
        `UPDATE Wedding SET
          Groom_Name = ?,
          Bride_Name = ?,
          Groom_Contact_no = ?,
          Bride_Contact_no = ?,
          Poruwa_CeremonyFrom = ?,
          Groom_Contact_no = ?,
          Poruwa_CeremonyTo = ?,
          Registration_Time = ?,
          Fountain = ?,
          ProsperityTable = ?,
          Groom_Address = ?,
          Bride_Address = ?
         WHERE Event_ID = ?`,
        [
          eventData.details?.groomName || '',
          eventData.details?.brideName || '',
          eventData.details?.groomContact || '',
          eventData.details?.brideContact || '',
          eventData.details?.poruwaCeremonyFrom || null,
          eventData.details?.groomContactNo || null,
          eventData.details?.poruwaCeremonyTo || null,
          eventData.details?.registrationTime || null,
          eventData.details?.fountain || 'no',
          eventData.details?.prosperityTable || 'no',
          eventData.details?.groomAddress || '',
          eventData.details?.brideAddress || '',
          eventId
        ]
      );
    } else { // Custom event
      await connection.query(
        `UPDATE CustomEvent SET
          Event_Name = ?,
          ContactPersonName = ?,
          ContactPersonNumber = ?
         WHERE Event_ID = ?`,
        [
          eventData.Event_Name || '',
          eventData.details?.contactPersonName || '',
          eventData.details?.contactPersonNumber || '',
          eventId
        ]
      );
    }

    await connection.commit();

    // Return updated event
    const [updated] = await connection.query(
      `SELECT * FROM Event 
       LEFT JOIN Wedding ON Event.Event_ID = Wedding.Event_ID
       LEFT JOIN CustomEvent ON Event.Event_ID = CustomEvent.Event_ID
       WHERE Event.Event_ID = ?`,
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

      // Determine event type
      const [wedding] = await connection.query(
        'SELECT 1 FROM Wedding WHERE Event_ID = ?',
        [eventId]
      );

      const [custom] = await connection.query(
        'SELECT 1 FROM CustomEvent WHERE Event_ID = ?',
        [eventId]
      );

      // Delete type-specific record
      if (wedding.length > 0) {
        await connection.query(
          `DELETE FROM Wedding WHERE Event_ID = ?`,
          [eventId]
        );
      } else if (custom.length > 0) {
        await connection.query(
          `DELETE FROM CustomEvent WHERE Event_ID = ?`,
          [eventId]
        );
      } else {
        throw new Error('Event type could not be determined');
      }

      // Delete base event
      await connection.query(
        'DELETE FROM Event WHERE Event_ID = ?',
        [eventId]
      );

      await connection.commit();
      return true;

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Get all events with type-specific details
  static async getAll() {
    const [events] = await db.query(`
    SELECT
      e.Event_ID,
      e.Buffet_TimeFrom,
      e.Buffet_TimeTo,
      e.Additional_Time,
      e.Function_durationFrom,
      e.Function_durationTo,
      e.Tea_table_Time,
      e.Dress_Time,
      e.booking_id,
      b.booking_date AS Event_Date,
      b.status,
      b.time_slot,
      b.number_of_guests,
      b.additional_hours,
      b.total_price,
      w.Groom_Name,
      w.Bride_Name,
      w.Groom_Contact_no,
      w.Bride_Contact_no,
      w.Poruwa_CeremonyFrom,
      w.Poruwa_CeremonyTo,
      w.Registration_Time,
      w.Fountain,
      w.ProsperityTable,
      w.Groom_Address,
      w.Bride_Address,
      c.Event_Name AS CustomEvent_Name,
      c.ContactPersonName,
      c.ContactPersonNumber
    FROM Event e
    LEFT JOIN Wedding w ON e.Event_ID = w.Event_ID
    LEFT JOIN CustomEvent c ON e.Event_ID = c.Event_ID
    LEFT JOIN Booking b ON e.booking_id = b.booking_id
    WHERE b.status IN ('confirmed', 'done','pending', 'cancelled')
  `);

    return events.map(event => {
      return {
        ...event,
        eventType: event.Groom_Name ? 'wedding' : 'custom',
        details: event.Groom_Name
          ? {
            groomName: event.Groom_Name,
            brideName: event.Bride_Name,
            groomContact: event.Groom_Contact_no,
            brideContact: event.Bride_Contact_no,
            poruwaCeremonyFrom: event.Poruwa_CeremonyFrom,
            poruwaCeremonyTo: event.Poruwa_CeremonyTo,
            registrationTime: event.Registration_Time,
            fountain: event.Fountain,
            prosperityTable: event.ProsperityTable,
            groomAddress: event.Groom_Address,
            brideAddress: event.Bride_Address
          }
          : {
            eventName: event.CustomEvent_Name,
            contactPersonName: event.ContactPersonName,
            contactPersonNumber: event.ContactPersonNumber
          }
      };
    });
  }

  // Get single event with details
  static async getById(eventId) {
    const [events] = await db.query(`
      SELECT 
        e.*,
        w.*,
        c.*
      FROM Event e
      LEFT JOIN Wedding w ON e.Event_ID = w.Event_ID
      LEFT JOIN CustomEvent c ON e.Event_ID = c.Event_ID
      WHERE e.Event_ID = ?
    `, [eventId]);

    if (events.length === 0) return null;

    const event = events[0];
    return {
      ...event,
      eventType: event.Event_Type,
      details: event.Event_Type === 'wedding' ? {
        groomName: event.Groom_Name,
        brideName: event.Bride_Name,
        poruwaTime: event.Poruwa_Time
      } : {
        eventName: event.Event_Name,
        contactPerson: event.Contact_Person,
        specialRequirements: event.Special_Requirements
      }
    };
  }
}

export default AllEvent;