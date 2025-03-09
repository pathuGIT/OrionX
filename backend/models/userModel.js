import pool from '../config/db.js';

//register super admin only once
export const registerSuperAdminSystemUserModel = async (pswd, employee_id) => {
    const [result] = await pool.query(
        'INSERT INTO systemuser (password, role, status, employee_id) VALUES (?, ?, ?, ?)',
        [pswd, 'super_admin', 'active', employee_id]
    );
    return result[0];
}

//register users 
export const registerSystemUserModel = async (pswd, employee_id) => {
    const [result] = await pool.query(
        'INSERT INTO systemuser (password, role, status, employee_id) VALUES (?, ?, ?, ?)',
        [pswd, 'employee', 'active', employee_id]
    );
    return result[0];
}

//get employees & system user by email or phone
export const getUserByUserEmailORPswdModel = async (credintial) => {
    const [result] = await pool.query(
        'select s.user_id, s.password, s.role, s.status, e.email, e.employee_id, s.refresh_token from systemuser s inner join employee e on s.employee_id = e.employee_id where email = ? || phone = ?',
        [credintial, credintial]
    );

    console.log(result[0].email)
    return result[0];
}

//get employee by email
export const getEmployeeByEmailModel = async (email) => {
    const [result] = await pool.query(
        'select * from employee where email = ?',
        [email]
    );
    console.log(result[0])
    return result[0];
}

//get employees by phone
export const getEmployeeByPhoneModel = async (phone) => {
    const [result] = await pool.query(
        'select * from employee where phone = ?',
        [phone]
    );
    console.log(result[0])
    return result[0];
}

//get system user by employeeId
export const getSystemUserByEmpIdModel = async (empId) => {
    const [result] = await pool.query(
        'select * from systemuser where employee_id = ?',
        [empId]
    );
    console.log(result[0])
    return result[0];
}

//register employees
export const registerEmployeeModel = async (name, phone, email, bod, salary) => {
    const hireDate = new Date().toISOString().split('T')[0];
    const [result] = await pool.query(
        'INSERT INTO employee (name,phone,email,bod,salary,hire_date) VALUES (?, ?, ?, ?, ?, ?)',
        [name, phone, email, bod, salary, hireDate]
    );
    return result[0];
}

//update user role
export const updateUserRoleModel = async (userId, role) => {
    const [result] = await pool.query(
        'UPDATE systemuser SET role = ? WHERE user_id = ? AND status = ? ',
        [role,userId,'active']
    );
    return result[0];
}

//check user is active ?
export const checkUserIsActive = async (userId) => {
    const [result] = await pool.query(
        'SELECT status FROM systemuser WHERE user_id = ?',
        [userId]
    );
    return result[0];
}