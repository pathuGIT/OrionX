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

// export const addOtpModel = async (email, otp, source_table) => {
//     await pool.query(
//         'INSERT INTO otp_store (email, otp, created_at, source_table) VALUES (?, ?, NOW(), ?)',
//         [email, otp, source_table]
//     );
// };

// export const deleteOtpModel = async (email) => {
//     await pool.query('DELETE FROM otp_store WHERE email = ?', [email]);
// };

// export const getOtpByEmailModel = async (email) => {
//     const [rows] = await pool.query('SELECT otp, created_at FROM otp_store WHERE email = ?', [email]);
//     return rows.length > 0 ? rows[0] : null;
// };