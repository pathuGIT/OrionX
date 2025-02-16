import pool from '../config/db.js';

export const createUser = async (name, pswd, email, bod, contact) => {
    const [result] = await pool.query(
        'INSERT INTO user (name, roll, password, email, bod, contact) VALUES (?, ?, ?, ?, ?, ?)',
        [name, 'employees', pswd, email, bod, contact]
    );
    return result;
};

export const loginBySuperAdmin = async (email, pswd) => {

}

//register only one time
export const registerByUserAdmin = async (name, pswd, email, bod, contact) => {
    const [result] = await pool.query(
        'INSERT INTO user (name, role, password, email, bod, contact) VALUES (?, ?, ?, ?, ?, ?)',
        [name, 'super_admin', pswd, email, bod, contact]
    );
    return result;
}

export const registerByEmployee = async (name, pswd, email, bod, contact) => {
    const [result] = await pool.query(
        'INSERT INTO user (name, role, password, email, bod, contact) VALUES (?, ?, ?, ?, ?, ?)',
        [name, 'employees', pswd, email, bod, contact]
    );
    return result;
}