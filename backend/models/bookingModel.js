import pool from '../config/db.js';

// Add a new venue to the venue table
export const addNewVenue = async ({ name, time, location, minCapacity, maxCapacity, price }) => {
    const today = new Date().toISOString().slice(0, 10);

    await pool.query(
        `INSERT INTO venue (venue_name, time_slot, Location, min_capacity, max_capacity, price, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [name, time, location, minCapacity, maxCapacity, price, today, today]
    );
};

// Get all venues
// export const getAllVenuesModel = async () => {
//     const [rows] = await pool.query(`SELECT * FROM venue`);
//     return rows;
// };
export const getAllVenuesModel = async () => {
    const [rows] = await pool.query(`
        SELECT 
            v.venue_id,
            v.venue_name,
            v.time_slot,
            v.Location,
            v.min_capacity,
            v.max_capacity,
            v.price,
            v.created_at,
            v.updated_at,
            CASE 
                WHEN COUNT(b.booking_id) > 0 THEN 'booked'
                ELSE 'not'
            END AS status
        FROM 
            venue v
        LEFT JOIN 
            booking b ON v.venue_id = b.venue_id
        GROUP BY 
            v.venue_id
    `);
    return rows;
};


export const deleteVenueByIdModel = async (id) => {
    const [result] = await pool.query(`DELETE FROM venue WHERE venue_id = ?`, [id]);
    return result;
};

export const checkVenuById = async (id) => {
    const [rows] = await pool.query(`SELECT * FROM venue WHERE venue_id = ?`, [id]);
    return rows.length > 0;
};

export const getVenueByIdModel = async (id) => {
    const [rows] = await pool.query(`SELECT * FROM venue WHERE venue_id = ?`, [id]);
    if (rows.length === 0) {
        return null; // Return null if no result found
    } else {
        return rows; // Return the first result
    }
};

export const updateNewVenueModel = async ({ id, name, time, location, minCapacity, maxCapacity, price }) => {
    const today = new Date().toISOString().slice(0, 10);
    console.log(id, name, time, location, minCapacity, maxCapacity, price );
    await pool.query(
        `UPDATE venue SET 
            venue_name = ?, 
            time_slot = ?, 
            Location = ?, 
            min_capacity = ?, 
            max_capacity = ?, 
            price = ?, 
            updated_at = ?
         WHERE venue_id = ?`,
        [name, time, location, minCapacity, maxCapacity, price, today, id]
    );
};

export const checkBookingByVenueId = async (venueId) => {
  const [rows] = await pool.query(
    'SELECT 1 FROM booking WHERE venue_id = ? LIMIT 1',
    [venueId]
  );
  return rows.length > 0;  // true if exists, false if not
};