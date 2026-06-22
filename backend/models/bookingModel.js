import pool from '../config/db.js';

// Add a new venue to the venue table
export const addNewVenue = async ({ name, time, location, minCapacity, maxCapacity, price, additionalHourFee, openedTimePeriod }) => {
  const conn = await pool.getConnection();
  try {
    const today = new Date().toISOString().slice(0, 10);

    await conn.query(
      `INSERT INTO venue (venue_name, time_slot, Location, min_capacity, max_capacity, price, created_at, updated_at, additional_hour_fee, opened_time_period)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, time, location, minCapacity, maxCapacity, price, today, today, additionalHourFee, openedTimePeriod]
    );
  } finally {
    conn.release();
  }
};

export const getAllVenuesModel = async () => {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(`
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
  } finally {
    conn.release();
  }
};


export const deleteVenueByIdModel = async (id) => {
  const conn = await pool.getConnection();
  try {
    const [result] = await conn.query(`DELETE FROM venue WHERE venue_id = ?`, [id]);
    return result;
  } finally {
    conn.release();
  }
};

export const checkVenuById = async (id) => {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(`SELECT * FROM venue WHERE venue_id = ?`, [id]);
    return rows.length > 0;
  } finally {
    conn.release();
  }
};

export const getVenueByIdModel = async (id) => {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(`SELECT * FROM venue WHERE venue_id = ?`, [id]);
    if (rows.length === 0) {
      return null; // Return null if no result found
    } else {
      return rows; // Return the first result
    }
  } finally {
    conn.release();
  }
};

export const updateNewVenueModel = async ({ id, name, time, location, minCapacity, maxCapacity, price, additionalHourFee, openedTimePeriod }) => {
  const conn = await pool.getConnection();

  try {
    const today = new Date().toISOString().slice(0, 10);
    await conn.query(
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
  } finally {
    conn.release();
  }
};

export const checkBookingByVenueId = async (venueId) => {
  try {
    const [rows] = await pool.query(
      'SELECT 1 FROM booking WHERE venue_id = ? LIMIT 1',
      [venueId]
    );
    return rows.length > 0; 
  } finally {
    conn.release();
  } // true if exists, false if not
};


/////////////
export const getVenueBytId = async (venueId) => {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query('SELECT * FROM venue WHERE venue_id = ?', [venueId]);
    return rows[0];
  } finally {
    conn.release();
  }
}

export const getSelectedMenuPrice = async (bookingId) => {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query('select x.price from view_item_category_menu_type x inner join customer_menu_item_selection z on x.ICMT_Id = z.ICMT_Id where booking_id = ? limit 1', [bookingId]);
    return rows[0];
  } finally {
    conn.release();
  }
}

export const insertBooking = async (booking) => {
  const conn = await pool.getConnection();
  try {
    const sql = `
      INSERT INTO booking
        (time_slot, status, booking_date, total_price, created_at, updated_at, venue_id, customer_id, number_of_guests, additional_hours)
      VALUES (?, ?, ?, 0.00, NOW(), NOW(), ?, ?, ?, ?)
    `;
    const params = [booking.slot, booking.status, booking.date, booking.venueId, booking.customerId, booking.guests, booking.extraHours || 0];
    await conn.query(sql, params);
  
    const [rows] = await conn.query(
      `SELECT booking_id FROM booking ORDER BY booking_id DESC LIMIT 1`
    );
    return rows.length ? rows[0].booking_id : null;
  } finally {
    conn.release();
  }
}

export const insertContract = async (contract) => {
  const conn = await pool.getConnection();
  try {
    const sql = `
      INSERT INTO contract
        ( booking_id, deposit_amount, damage_fee, refund_amount, status, created_at, updated_at)
      VALUES (?, ?, 0.00, 0.00, 'pending', NOW(), NOW())
    `;
    await conn.query(sql, [contract.bookingId, contract.payDeposit]);
  } finally {
    conn.release();
  }
}

export const insertPricing = async (pricing) => {
  const conn = await pool.getConnection();
  try {
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
    await conn.query(sql, params);
  } finally {
    conn.release();
  }
}

export const getDamageFeeForfeited = async (bookingId) => {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      "SELECT damage_fee FROM contract WHERE booking_id = ? AND status = 'forfeited'",
      [bookingId]
    );
    return rows.length ? parseFloat(rows[0].damage_fee) : 0.00;
  } finally {
    conn.release();
  }
}

export const getBookingById = async (id) => {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query('SELECT * FROM booking WHERE booking_id = ?', [id]);
    return rows[0];
  } finally {
    conn.release();
  }
}

export const checkBookingExists = async (date, slot, venueId) => {
  const conn = await pool.getConnection();
  try {
    return conn.query(
      'SELECT 1 FROM booking WHERE booking_date = ? AND time_slot = ? AND venue_id = ? AND status = ? LIMIT 1',
      [date, slot, venueId, 'confirmed']
    ).then(([rows]) => rows.length > 0);
  } finally {
    conn.release();
  }
}


///////////////////// advance booking view models

export const getAllBookings = async (status) => {
  const conn = await pool.getConnection();
  try {
    let sql = `SELECT b.*, c.contract_id, c.deposit_amount, c.damage_fee, c.refund_amount, c.status as contract_status,
      p.id as pricing_id, p.menu_price_total, p.hall_charge, p.extra_hour_fee, p.bites_payment, p.fountain_payment, p.other_payment, p.overall_total
      FROM booking b
      LEFT JOIN contract c ON b.booking_id = c.booking_id
      LEFT JOIN booking_pricing p ON b.booking_id = p.booking_id`;
  
    const params = [];
    if (status && status !== 'all') {
      sql += ` WHERE b.status = ?`;
      params.push(status);
    }
    sql += ` ORDER BY b.booking_date DESC`;
    return conn.query(sql, params).then(([rows]) => rows);
  } finally {
    conn.release();
  }
}

export const searchAllBookings = async (item) => {
  const conn = await pool.getConnection();
  try {
    let sql = `SELECT b.*, c.contract_id, c.deposit_amount, c.damage_fee, c.refund_amount, c.status as contract_status,
      p.id as pricing_id, p.menu_price_total, p.hall_charge, p.extra_hour_fee, p.bites_payment, p.fountain_payment, p.other_payment, p.overall_total
      FROM booking b
      LEFT JOIN contract c ON b.booking_id = c.booking_id
      LEFT JOIN booking_pricing p ON b.booking_id = p.booking_id`;
    const params = [];
    if (item && item !== 'all') {
      sql += ` WHERE b.booking_id = ? || b.customer_id = ? `;
      params.push(item, item, item, item);
    }
    sql += ` ORDER BY b.booking_date DESC`;
    return conn.query(sql, params).then(([rows]) => rows);
  } finally {
    conn.release();
  }
}

export const getBookingByIdAdvance = async (bookingId) => {
  const conn = await pool.getConnection();
  try {
    const sql = `SELECT b.*, c.contract_id, c.status as contract_status, c.deposit_amount, c.damage_fee, c.refund_amount, p.*, v.time_slot as venu_time_slot FROM booking b
      LEFT JOIN contract c ON b.booking_id = c.booking_id
      LEFT JOIN booking_pricing p ON b.booking_id = p.booking_id
      LEFT JOIN venue v ON v.venue_id = b.venue_id
      WHERE b.booking_id = ?`;
    return conn.query(sql, [bookingId]).then(([rows]) => rows[0]);
  } finally {
    conn.release();
  }
}

export const printBookingDetails = async (bookingId) => {
  const conn = await pool.getConnection();
  try {
    const sql = `
          SELECT 
          b.booking_id, 
          b.time_slot AS b_time_slot, 
          b.status AS b_status, 
          b.booking_date, 
          b.total_price AS b_total_price, 
          b.number_of_guests AS b_number_of_guests, 
          b.additional_hours AS b_additional_hours, 
          v.*, 
          c.customer_id, 
          c.name, 
          c.email, 
          c.address, 
          c.phone, 
          x.deposit_amount, 
          x.damage_fee, 
          x.refund_amount, 
          x.status AS contract_status, 
          z.menu_price_total, 
          z.hall_charge, 
          z.extra_hour_fee, 
          z.bites_payment, 
          z.fountain_payment, 
          z.other_payment, 
          z.overall_total, 
          z.forfeited_deposit 
      FROM 
          booking b 
      INNER JOIN 
          venue v ON b.venue_id = v.venue_id 
      INNER JOIN 
          customer c ON c.customer_id = b.customer_id 
      INNER JOIN 
          contract x ON x.booking_id = b.booking_id 
      INNER JOIN 
          booking_pricing z ON z.booking_id = x.booking_id
      WHERE 
          b.booking_id = ?`;
  
    return conn.query(sql, [bookingId]).then(([rows]) => rows[0]);
  } finally {
    conn.release();
  }
}

export const updateBookingStatusModel = async (bookingId, status) => {
  const conn = await pool.getConnection();
  try {
    return await conn.query(
      `UPDATE booking SET status = ?, updated_at = NOW() WHERE booking_id = ?`,
      [status, bookingId]
    );
  } finally {
    conn.release();
  }
}

export const updateContractModel = async (bookingId, data) => {
  const conn = await pool.getConnection();
  try {
    const { depositAmount, damageFee, refundAmount, status } = data;
    const sql = `UPDATE contract SET deposit_amount=?, damage_fee=?, refund_amount=?, status=?, updated_at=NOW() WHERE booking_id=?`;
    return conn.query(sql, [depositAmount, damageFee, refundAmount, status, bookingId]);
  
  } finally {
    conn.release();
  }
}

export const updatePricingModel = async (bookingId, data) => {
  const conn = await pool.getConnection();
  const { menuPriceTotal, hallCharge, extraHourFee, bitesPayment, fountainPayment, otherPayment, forfeitedDeposit } = data;
  try {
    const sql = `UPDATE booking_pricing SET menu_price_total=?, hall_charge=?, extra_hour_fee=?, bites_payment=?, fountain_payment=?, other_payment=?, forfeited_deposit=?, updated_at=NOW() WHERE booking_id=?`;
    return conn.query(sql, [menuPriceTotal, hallCharge, extraHourFee, bitesPayment, fountainPayment, otherPayment, forfeitedDeposit, bookingId]);
  
  } finally {
    conn.release();
  }
}

export const updateBookingPricingModel = async (bookingId, data) => {
  const { hallCharge, extraHourFee } = data;
  const conn = await pool.getConnection();
  try {
    const sql = `UPDATE booking_pricing SET hall_charge=?, extra_hour_fee=?, updated_at=NOW() WHERE booking_id=?`;
    return conn.query(sql, [hallCharge, extraHourFee, bookingId]);
  } finally {
    conn.release();
  }
}

export const updateBookingVenueModel = async (bookingId, venueId) => {
  const conn = await pool.getConnection();
  try {
    return conn.query(
      `UPDATE booking SET venue_id = ? WHERE booking_id = ?`,
      [venueId, bookingId]
    );
  } finally {
    conn.release();
  }
}

export const updateDateModel = async (bookingId, date) => {
  const conn = await pool.getConnection();
  try {
    const sql = `UPDATE booking SET booking_date = ?, updated_at = NOW() WHERE booking_id = ?`;
    return conn.query(sql, [date, bookingId]);
  } finally {
    conn.release();
  }
}
//
export const updateDamageFeeModel = async (bookingId, damageFee, refundAmount, depositAmount, status) => {
  const conn = await pool.getConnection();
  try {
    const sql = `UPDATE contract SET damage_fee = ?, refund_amount = ?, deposit_amount = ?, status = ?,  updated_at = NOW() WHERE booking_id = ?`;
    return await conn.query(sql, [damageFee, refundAmount, depositAmount, status, bookingId]);
  
  } finally {
    conn.release();
  }
}

export const getContractById = async (bookingId) => {
  const conn = await pool.getConnection();
  try {
    const sql = `SELECT * FROM contract WHERE booking_id = ?`;
    return await conn.query(sql, [bookingId]).then(([rows]) => rows[0]);
  } finally {
    conn.release();
  }
}

export const getBookingPricingById = async (bookingId) => {
  const conn = await pool.getConnection();
  try {
    const sql = `SELECT * FROM booking_pricing WHERE booking_id = ?`;
    return await conn.query(sql, [bookingId]).then(([rows]) => rows[0]);
  } finally {
    conn.release();
  }
}

export const updateGuestsModel = async (bookingId, guests) => {
  const conn = await pool.getConnection();
  try {
    return conn.query(
      `UPDATE booking SET number_of_guests = ?, updated_at = NOW() WHERE booking_id = ?`,
      [guests, bookingId]
    );
  } finally {
    conn.release();
  }
}

export const updateAdditionalHoursModel = async (bookingId, additionalHours) => {
  const conn = await pool.getConnection();
  try {
    return conn.query(
      `UPDATE booking SET additional_hours = ?, updated_at = NOW() WHERE booking_id = ?`,
      [additionalHours, bookingId]
    );
  } finally {
    conn.release();
  }
}

export const getBiteSoftLiquorFromEventModel = async (bookingId) => {
  const conn = await pool.getConnection();
  try {
    const sql = `
      select bar.TotalBitePrice 
        from bar inner join event 
        on bar.BarRequirementID = event.BarRequirementID 
        where event.booking_id = ?;
    `;
    return await conn.query(sql, [bookingId]).then(([rows]) => rows[0]);
  } finally {
    conn.release();
  }
}

export const UpdateBookingPrice_BiteSoftLiquorModel = async (bookingId, TotalBitePrice) => {
  const conn = await pool.getConnection();
  try {
    const sql = `
      UPDATE booking_pricing
      SET bites_payment = ?,  
          updated_at = NOW()
      WHERE booking_id = ?
    `;
    const [result] = await conn.query(sql, [TotalBitePrice, bookingId]);
    return result; // <-- return the result object, not the array
  } finally {
    conn.release();
  }
}