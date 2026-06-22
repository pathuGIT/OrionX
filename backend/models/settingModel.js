import pool from '../config/db.js';

export const findUserById = async userId => {
  const conn = await pool.getConnection();
    const [rows] = await conn.query(
      `SELECT u.user_id, u.role, u.status, e.name, e.email, u.password
       FROM systemuser u
       JOIN employee e ON u.employee_id = e.employee_id
       WHERE u.user_id = ?`, [userId]
    );  
conn.release(); // ✅ Always release the connection
  return rows[0];
};

export const updateUserProfile = async (userId, name, email) => {
  const conn = await pool.getConnection();
    await conn.query(
      `UPDATE employee SET name = ?, email = ?
       WHERE employee_id = (SELECT employee_id FROM systemuser WHERE user_id = ?)`,
      [name, email, userId]
    );
conn.release(); // ✅ Always release the connection

};

export const changeUserPassword = async (userId, hash) => {
  const conn = await pool.getConnection();
try {
    await conn.query(`UPDATE systemuser SET password = ? WHERE user_id = ?`, [hash, userId]);
  
} finally {
conn.release(); // ✅ Always release the connection
}};

export const listAdmins = async () => {
  const conn = await pool.getConnection();
    const [rows] = await conn.query(
      `SELECT u.user_id, u.role, e.name, e.email
       FROM systemuser u
       JOIN employee e ON u.employee_id = e.employee_id
       WHERE u.role IN ('super_admin','sub_admin') AND u.status = 'active'`
    );
conn.release(); // ✅ Always release the connection
  return rows;
};

export const listEmployees = async () => {
  const conn = await pool.getConnection();
   const [rows] = await conn.query(`SELECT * FROM employee`);
conn.release(); // ✅ Always release the connection
  return rows;
};

export const assignSubAdmin = async employeeId => {
  const conn = await pool.getConnection();

    const [result] = await conn.query(
      `UPDATE systemuser SET role = 'sub_admin', status = 'active'
       WHERE user_id = ?`,
      [employeeId]
    );
conn.release(); // ✅ Always release the connection
  return { user_id: employeeId, role: 'sub_admin', name: '', email: '' };
};

export const deactivateAdmin = async userId => {
  const conn = await pool.getConnection();
try {
    await conn.query(`UPDATE systemuser SET status = 'inactive' WHERE user_id = ?`, [userId]);
  
} finally {
conn.release(); // ✅ Always release the connection
}};

export const updateUserRole = async (userId, role) => {
  const conn = await pool.getConnection();
try {
    console.log("Updating user role:", { userId, role })
    await conn.query(
      `UPDATE systemuser SET role = ? WHERE employee_id = ?`,
      [role, userId]
    )
    
    const [user] = await conn.query(`
      SELECT u.user_id, u.role, e.name, e.email 
      FROM systemuser u
      JOIN employee e ON u.employee_id = e.employee_id
      WHERE u.user_id = ?
    `, [userId])
} finally {
conn.release(); // ✅ Always release the connection
}
  
  return user[0]
}