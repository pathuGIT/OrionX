import db from '../config/db.js';  // assume mysql2/promise pool

export async function fetchKpis() {
  const conn = await db.getConnection();

    // total bookings
    const [[{ totalBookings }]] = await conn.query(
      `SELECT COUNT(*) AS totalBookings FROM booking`
    );
  
    // upcoming events = bookings from today onward
    const [[{ upcomingEvents }]] = await conn.query(
      `SELECT COUNT(*) AS upcomingEvents
       FROM booking
       WHERE booking_date >= CURDATE()
         AND status IN ('confirmed','pending')`
    );
  
    // monthly revenue = this calendar month
    const [[{ monthlyRevenue }]] = await conn.query(
      `SELECT IFNULL(SUM(total_price),0) AS monthlyRevenue
       FROM booking
       WHERE YEAR(booking_date) = YEAR(CURDATE())
         AND MONTH(booking_date) = MONTH(CURDATE())`
    );
  
    // total distinct customers who have ever booked
    const [[{ totalCustomers }]] = await conn.query(
      `SELECT COUNT(DISTINCT customer_id) AS totalCustomers
       FROM booking`
    );
    conn.release(); // ✅ Always release the connection
    return {
      totalBookings,
      upcomingEvents,
      monthlyRevenue,
      totalCustomers
    };
}



export async function fetchRevenueTrend() {
  const conn = await db.getConnection();
  // revenue grouped by YYYY-MM
 
   const [rows] = await conn.query(
     `SELECT
        DATE_FORMAT(booking_date, '%Y-%m') AS month,
        IFNULL(SUM(total_price),0) AS total_price
      FROM booking
      WHERE status = 'done'
      GROUP BY month
      ORDER BY month`
   );
 
  conn.release(); // ✅ Always release the connection
  // rows: [ { month: '2025-05', total_price: 90000 }, … ]
  return rows;
}

export async function fetchRecentBookings() {
  // revenue grouped by YYYY-MM
  const conn = await db.getConnection();
  const [rows] = await conn.query(
    `SELECT
    b.booking_id,
    c.name,
    b.booking_date,
    b.total_price,
    b.status
FROM
    booking b
INNER JOIN
    customer c ON b.customer_id = c.customer_id
WHERE
    b.status = 'confirmed'
    AND b.updated_at BETWEEN NOW() - INTERVAL 5 DAY AND NOW()
    AND b.booking_date >= CURDATE()
ORDER BY
    b.updated_at DESC
LIMIT 3`
  );
  conn.release(); // ✅ Always release the connection
  return rows;
}