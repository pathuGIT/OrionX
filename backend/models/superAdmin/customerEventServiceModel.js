import db from '../../config/db.js';

class CustomerEventService {
  static async getAll() {
    const conn = await db.getConnection();
    try {
      const query = `
        SELECT 
          ces.my_row_id,
          ces.customer_id,
          c.name AS customer_name,
          c.email AS customer_email,
          ces.event_service_id,
          es.Event_Service_Name AS service_name,
          es.image_path,
          ces.booking_id
        FROM customer_event_service ces
        JOIN customer c ON ces.customer_id = c.customer_id
        JOIN event_service es ON ces.event_service_id = es.Event_Service_ID
      `;
      const [rows] = await conn.query(query);
      return rows;
    } finally {
      conn.release();
    }
  }

  static async getById(id) {
    const conn = await db.getConnection();
    try {
      const query = `
        SELECT 
          ces.my_row_id,
          ces.customer_id,
          c.name AS customer_name,
          ces.event_service_id,
          es.Event_Service_Name AS service_name,
          ces.booking_id
        FROM customer_event_service ces
        JOIN customer c ON ces.customer_id = c.customer_id
        JOIN event_service es ON ces.event_service_id = es.Event_Service_ID
        WHERE ces.my_row_id = ?
      `;
      const [rows] = await conn.query(query, [id]);
      return rows[0] || null;
    } finally {
      conn.release();
    }
  }

  static async create(data) {
    const conn = await db.getConnection();
    try {
      const { customer_id, event_service_id, booking_id } = data;
      const query = `
        INSERT INTO customer_event_service 
          (customer_id, event_service_id, booking_id) 
        VALUES (?, ?, ?)
      `;
      const [result] = await conn.query(query, [customer_id, event_service_id, booking_id]);
      return { my_row_id: result.insertId, ...data };
    } finally {
      conn.release();
    }
  }

  static async update(id, data) {
    const conn = await db.getConnection();
    try {
      const { customer_id, event_service_id, booking_id } = data;
      const query = `
        UPDATE customer_event_service 
        SET 
          customer_id = ?,
          event_service_id = ?
        WHERE booking_id = ?
      `;
      await conn.query(query, [customer_id, event_service_id, booking_id, id]);
      return { my_row_id: id, ...data };
    } finally {
      conn.release();
    }
  }

  static async delete(id) {
    const conn = await db.getConnection();
    try {
      const query = 'DELETE FROM customer_event_service WHERE my_row_id = ?';
      await conn.query(query, [id]);
      return true;
    } finally {
      conn.release();
    }
  }

  static async getAllCustomer() {
    const conn = await db.getConnection();
    try {
      const query = `
        SELECT 
          customer_id, 
          name, 
          email,
          address,
          phone,
          staus AS status,
          create_date AS created_at
        FROM customer
        WHERE staus = 'active'
        ORDER BY name
      `;
      const [rows] = await conn.query(query);
      return rows;
    } finally {
      conn.release();
    }
  }

  static async getAllBooking() {
    const conn = await db.getConnection();
    try {
      const query = `
        SELECT 
          b.booking_id,
          b.booking_date,
          b.time_slot,
          b.status,
          b.total_price,
          b.number_of_guests,
          b.additional_hours,
          b.customer_id,
          c.name AS customer_name,
          c.email AS customer_email,
          c.phone AS customer_phone
        FROM booking b
        JOIN customer c ON b.customer_id = c.customer_id
        WHERE b.status IN ('confirmed', 'pending')
        ORDER BY b.booking_date DESC
      `;
      const [rows] = await conn.query(query);
      return rows;
    } finally {
      conn.release();
    }
  }

  static async getAllEventServicesSimple() {
    const conn = await db.getConnection();
    try {
      const [events] = await conn.query(`
            SELECT 
                Event_Service_ID AS id,
                Event_Service_Name AS name
            FROM event_service
        `);
      return events;
    } catch (error) {
      console.error('Error fetching services:', error);
      throw error;
    } finally {
      conn.release();
    }
  }
}

export default CustomerEventService;