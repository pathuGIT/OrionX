import pool from '../config/db.js';

// Add a new venue to the venue table
export const addNewVenue = async ({ name, time, location, minCapacity, maxCapacity, price, additionalHourFee, openedTimePeriod }) => {
    const today = new Date().toISOString().slice(0, 10);

    await pool.query(
        `INSERT INTO venue (venue_name, time_slot, Location, min_capacity, max_capacity, price, created_at, updated_at, additional_hour_fee, opened_time_period)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [name, time, location, minCapacity, maxCapacity, price, today, today, additionalHourFee, openedTimePeriod]
    );
};

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
            v.additional_hour_fee,
            v.opened_time_period,
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

export const updateNewVenueModel = async ({ id, name, time, location, minCapacity, maxCapacity, price, additionalHourFee, openedTimePeriod}) => {
    const today = new Date().toISOString().slice(0, 10);
    await pool.query(
        `UPDATE venue SET 
            venue_name = ?, 
            time_slot = ?, 
            Location = ?, 
            min_capacity = ?, 
            max_capacity = ?, 
            price = ?, 
            updated_at = ?,
            additional_hour_fee = ?,
            opened_time_period = ?
         WHERE venue_id = ?`,
        [name, time, location, minCapacity, maxCapacity, price, today, additionalHourFee, openedTimePeriod, id]
    );
};

export const checkBookingByVenueId = async (venueId) => {
  const [rows] = await pool.query(
    'SELECT 1 FROM booking WHERE venue_id = ? LIMIT 1',
    [venueId]
  );
  return rows.length > 0;  // true if exists, false if not
};


/////////////
export const getVenueBytId = async (venueId) => {
  const [rows] = await pool.query('SELECT * FROM venue WHERE venue_id = ?', [venueId]);
  return rows[0];
}

export const insertBooking = async (booking) => {
  const sql = `
    INSERT INTO booking
      (time_slot, status, booking_date, total_price, created_at, updated_at, venue_id, customer_id, number_of_guests, additional_hours)
    VALUES (?, ?, ?, 0.00, NOW(), NOW(), ?, ?, ?, ?)
  `;
  const params = [booking.slot, booking.status, booking.date, booking.venueId, booking.customerId, booking.guests, booking.extraHours || 0];
  await pool.query(sql, params);

  // Fetch the latest booking_id for this customer, venue, and date
//   const [rows] = await pool.query(
//     `SELECT booking_id FROM booking
//      WHERE customer_id = ? AND venue_id = ? AND booking_date = ?
//      ORDER BY created_at DESC LIMIT 1`,
//     [booking.customerId, booking.venueId, booking.date]
//   );
  const [rows] = await pool.query(
    `SELECT booking_id FROM booking ORDER BY booking_id DESC LIMIT 1`
  );
  console.log("assssssssss:",rows[0].booking_id);
  return rows.length ? rows[0].booking_id : null;
}

export const insertContract = async (contract) => {
  const sql = `
    INSERT INTO contract
      ( booking_id, deposit_amount, damage_fee, refund_amount, status, created_at, updated_at)
    VALUES (?, 50000.00, 0.00, 0.00, 'pending', NOW(), NOW())
  `;
  await pool.query(sql, [contract.bookingId]);
}

export const insertPricing = async (pricing) => {
  const sql = `
    INSERT INTO booking_pricing
      (booking_id, menu_price_total, hall_charge, extra_hour_fee, overall_total, forfeited_deposit, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
  `;
  const params = [
    pricing.bookingId,
    pricing.menuPriceTotal,
    pricing.hallCharge,
    pricing.extraHourFee,
    pricing.overallTotal,
    pricing.forfeitedDeposit
  ];
  await pool.query(sql, params);
}

export const getDamageFeeForfeited = async (bookingId) => {
  const [rows] = await pool.query(
    "SELECT damage_fee FROM contract WHERE booking_id = ? AND status = 'forfeited'",
    [bookingId]
  );
  return rows.length ? parseFloat(rows[0].damage_fee) : 0.00;
}

export const getBookingById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM booking WHERE booking_id = ?', [id]);
  return rows[0];
}
