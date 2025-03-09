import pool from '../config/db.js';

export const getCustomerByEmailModel = async (email) => {
    const [result] = await pool.query(
        'select * from customer where email = ?',
        [email]
    );
    console.log(result[0])
    return result[0];
}

export const getCustomerByPhoneModel = async (phone) => {
    console.log(phone)
    const [result] = await pool.query(
        'select * from customer where phone = ?',
        [phone]
    );
    console.log(result[0])
    return result[0];
}

export const registerCustomerModel = async (name, email, address, phone) => {
    const create_date = new Date().toISOString().split('T')[0];
    const [result] = await pool.query(
        'INSERT INTO customer (name, email, role, address, phone, staus, create_date) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [name, email, 'customer', address, phone, 'active', create_date]
    );
    return result[0];
}