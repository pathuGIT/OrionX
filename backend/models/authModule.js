import pool from '../config/db.js';

export const saveRefreshTokenModel = async (token, userId) => {
    await pool.query('UPDATE systemuser SET refresh_token = ? WHERE user_id = ?', [token, userId]);
}

export const isRefreshTokenValidModel = async (userId, token) => {
    const [rows] = await pool.query('SELECT refresh_token FROM systemuser WHERE user_id = ?', [userId]);
    if (rows.length === 0) {
        return false; // No user found with the provided userId
    }
    return rows[0].refresh_token === token;
};