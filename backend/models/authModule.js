import pool from '../config/db.js';

// export const saveSystemuserRefreshTokenModel = async (token, userId) => {
//     await pool.query('UPDATE systemuser SET refresh_token = ? WHERE user_id = ?', [token, userId]);
// }

// export const saveCustomerRefreshTokenModel = async (token, customer_id) => {
//     await pool.query('UPDATE customer SET refresh_token = ? WHERE customer_id = ?', [token, customer_id]);
// }

export const saveSystemuserRefreshTokenModel = async (token, userId) => {
    const conn = await pool.getConnection();
    try {
        await conn.query('UPDATE systemuser SET refresh_token = ? WHERE user_id = ?', [token, userId]);
    } finally {
        conn.release(); // ✅ Always release the connection
    }
};

export const saveCustomerRefreshTokenModel = async (token, customer_id) => {
    const conn = await pool.getConnection();
    try {
        await conn.query('UPDATE customer SET refresh_token = ? WHERE customer_id = ?', [token, customer_id]);
    } finally {
        conn.release(); // ✅ Always release the connection
    }
};


export const isRefreshTokenValidModel = async (userId, token) => {
    const conn = await pool.getConnection();
    try {
        const [rows] = await pool.query('SELECT refresh_token FROM systemuser WHERE user_id = ?', [userId]);
        if (rows.length === 0) {
            return false; // No user found with the provided userId
        }
        return rows[0].refresh_token === token;
    } catch (error) {
         conn.release();
    }
};

export const checkEmailModel = async (email) => {
    const conn = await pool.getConnection();
    try {
        const [rows] = await conn.query(
            'SELECT email, "employee" AS source_table FROM employee WHERE email = ? UNION SELECT email, "customer" AS source_table FROM customer WHERE email = ?',
            [email, email]
        );
        return rows[0];
    } catch (error) {
        conn.release();
    }
};
