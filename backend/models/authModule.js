import pool from '../config/db.js';

export const saveSystemuserRefreshTokenModel = async (token, userId) => {
    await pool.query('UPDATE systemuser SET refresh_token = ? WHERE user_id = ?', [token, userId]);
}

export const saveCustomerRefreshTokenModel = async (token, customer_id) => {
    await pool.query('UPDATE customer SET refresh_token = ? WHERE customer_id = ?', [token, customer_id]);
}

export const isRefreshTokenValidModel = async (userId, token) => {
    const [rows] = await pool.query('SELECT refresh_token FROM systemuser WHERE user_id = ?', [userId]);
    if (rows.length === 0) {
        return false; // No user found with the provided userId
    }
    return rows[0].refresh_token === token;
};

export const checkEmailModel = async (email) => {
    const [rows] = await pool.query(
        'SELECT email, "employee" AS source_table FROM employee WHERE email = ? UNION SELECT email, "customer" AS source_table FROM customer WHERE email = ?',
        [email, email]
    );
    return rows[0];
};