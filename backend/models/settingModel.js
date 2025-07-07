import pool from '../config/db.js';

export const findUserById = async userId => {
  const [rows] = await pool.query(
    `SELECT u.user_id, u.role, u.status, e.name, e.email, u.password
     FROM systemuser u
     JOIN employee e ON u.employee_id = e.employee_id
     WHERE u.user_id = ?`, [userId]
  );
  return rows[0];
};

export const updateUserProfile = async (userId, name, email) => {
  await pool.query(
    `UPDATE employee SET name = ?, email = ?
     WHERE employee_id = (SELECT employee_id FROM systemuser WHERE user_id = ?)`,
    [name, email, userId]
  );
};

export const changeUserPassword = async (userId, hash) => {
  await pool.query(`UPDATE systemuser SET password = ? WHERE user_id = ?`, [hash, userId]);
};

export const listAdmins = async () => {
  const [rows] = await pool.query(
    `SELECT u.user_id, u.role, e.name, e.email
     FROM systemuser u
     JOIN employee e ON u.employee_id = e.employee_id
     WHERE u.role IN ('super_admin','sub_admin') AND u.status = 'active'`
  );
  return rows;
};

export const listEmployees = async () => {
  const [rows] = await pool.query(`SELECT * FROM employee`);
  return rows;
};

export const assignSubAdmin = async employeeId => {
  const [result] = await pool.query(
    `UPDATE systemuser SET role = 'sub_admin', status = 'active'
     WHERE user_id = ?`,
    [employeeId]
  );
  return { user_id: employeeId, role: 'sub_admin', name: '', email: '' };
};

export const deactivateAdmin = async userId => {
  await pool.query(`UPDATE systemuser SET status = 'inactive' WHERE user_id = ?`, [userId]);
};

export const updateUserRole = async (userId, role) => {
  console.log("Updating user role:", { userId, role })
  await pool.query(
    `UPDATE systemuser SET role = ? WHERE employee_id = ?`,
    [role, userId]
  )
  
  const [user] = await pool.query(`
    SELECT u.user_id, u.role, e.name, e.email 
    FROM systemuser u
    JOIN employee e ON u.employee_id = e.employee_id
    WHERE u.user_id = ?
  `, [userId])
  
  return user[0]
}