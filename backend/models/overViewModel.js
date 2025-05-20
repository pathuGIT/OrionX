import db from '../config/db.js';  // assume mysql2/promise pool

export async function fetchKpis() {
  // total bookings
  const [[{ totalBookings }]] = await db.query(
    `SELECT COUNT(*) AS totalBookings FROM booking`
  );

  // upcoming events = bookings from today onward
  const [[{ upcomingEvents }]] = await db.query(
    `SELECT COUNT(*) AS upcomingEvents
     FROM booking
     WHERE booking_date >= CURDATE()
       AND status IN ('confirmed','pending')`
  );

  // monthly revenue = this calendar month
  const [[{ monthlyRevenue }]] = await db.query(
    `SELECT IFNULL(SUM(total_price),0) AS monthlyRevenue
     FROM booking
     WHERE YEAR(booking_date) = YEAR(CURDATE())
       AND MONTH(booking_date) = MONTH(CURDATE())`
  );

  // total distinct customers who have ever booked
  const [[{ totalCustomers }]] = await db.query(
    `SELECT COUNT(DISTINCT customer_id) AS totalCustomers
     FROM booking`
  );

  return {
    totalBookings,
    upcomingEvents,
    monthlyRevenue,
    totalCustomers
  };
}

export async function fetchRevenueTrend() {
  // revenue grouped by YYYY-MM
  const [rows] = await db.query(
    `SELECT
       DATE_FORMAT(booking_date, '%Y-%m') AS month,
       IFNULL(SUM(total_price),0) AS total_price
     FROM booking
     WHERE status = 'done'
     GROUP BY month
     ORDER BY month`
  );
  // rows: [ { month: '2025-05', total_price: 90000 }, … ]
  return rows;
}
