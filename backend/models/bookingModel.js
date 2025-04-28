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