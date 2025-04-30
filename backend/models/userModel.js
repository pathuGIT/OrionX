import pool from '../config/db.js';

//register super admin only once
export const registerSuperAdminSystemUserModel = async (pswd, employee_id) => {
    const [result] = await pool.query(
        'INSERT INTO systemuser (password, role, status, employee_id) VALUES (?, ?, ?, ?)',
        [pswd, 'super_admin', 'active', employee_id]
    );
    return result[0];
}

//register emplyoee
export const registerEmployeeModel = async (pswd, employee_id) => {
    const [result] = await pool.query(
        'INSERT INTO systemuser (password, role, status, employee_id) VALUES (?, ?, ?, ?)',
        [pswd, 'employee', 'active', employee_id]
    );
    return result[0];
}


//get employees & system user by email or phone
// export const getUserByUserEmailORPswdModel = async (credintial) => {
//     const [result] = await pool.query(
//         'select s.user_id, s.password, s.role, s.status, e.email, e.employee_id, s.refresh_token from systemuser s inner join employee e on s.employee_id = e.employee_id where email = ? || phone = ?',
//         [credintial, credintial]
//     );

//     console.log(result[0].email)
//     return result[0];
// }

//get employee by email

// Get employees & system users by email or phone
export const getUserByUserEmailORPswdModel = async (credential) => {
    console.log(typeof(credential))
    const [result] = await pool.query(
        'SELECT s.user_id, s.password, s.role, s.status, e.email, e.employee_id, s.refresh_token FROM systemuser s INNER JOIN employee e ON s.employee_id = e.employee_id WHERE e.email = ? OR e.phone = ?',
        [credential, parseInt(credential, 10)|| 0]
        //[credential, credential]
    );

    console.log("User Found:", result[0]);
    if (result.length === 0) return null; // Prevent accessing undefined index

    
    return result[0];
};

export const getEmployeeByEmailModel = async (email) => {
    const [result] = await pool.query(
        'select * from employee where email = ?',
        [email]
    );
    console.log(result[0])
    return result[0]
}

//get employees by phone
export const getEmployeeByPhoneModel = async (phone) => {
    const [result] = await pool.query(
        'select * from employee where phone = ?',
        [phone]
    );
    
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
export const addEmployeeModel = async (name, phone, email, bod, serviceCharge, salary) => {
    const hireDate = new Date().toISOString().split('T')[0];
    const [result] = await pool.query(
        'INSERT INTO employee (name,phone,email,bod,salary,service_charge_precentage,hire_date) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [name, phone, email, bod, salary, serviceCharge, hireDate]
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
//get employees
export const getEmployeeModel = async () => {
    
    const [result] = await pool.query(
        'SELECT employee_id, name, phone, email, DATE_FORMAT(bod, "%Y-%m-%d") AS bod, salary, service_charge_precentage, DATE_FORMAT(hire_date, "%Y-%m-%d") AS hire_date FROM employee'
    );
    return result;
}

 //get employee by id
export const getEmployeeByuserIdModel = async (employee_id) => {
    const [result] = await pool.query(
        'SELECT employee_id, name, phone, email, DATE_FORMAT(bod, "%Y-%m-%d") AS bod, salary, service_charge_precentage, DATE_FORMAT(hire_date, "%Y-%m-%d") AS hire_date FROM employee WHERE employee_id = ?',
        [employee_id]
    );
    return result[0]; 
};

//update employees
export const updateEmployeesModel = async (employee_id, name, phone, email, bod, salary, service_charge_precentage, hire_date) => {
    const [result] = await pool.query(
        'UPDATE employee SET name = ?, phone = ?, email = ?, bod = ?, salary = ?, service_charge_precentage = ?, hire_date =?  WHERE employee_id = ?',  
        [name, phone, email, bod, salary, service_charge_precentage, hire_date, employee_id]
    );
    return result[0]; 
};

//delete employees
export const deleteEmployeesModel = async (employee_id) => {
    const [result] = await pool.query(
        'DELETE FROM employee WHERE employee_id = ?',
        [employee_id]
    );
    return result[0];
};

//update employee(systemuser) status
export const updateEmployeesStatusModel = async (employee_id, status) => {

    const [result] = await pool.query(
        'UPDATE systemuser SET status = ? WHERE employee_id = ?',
        [status, employee_id]

    ); return result[0]; 
};

//get employees by status
export const getEmployeesByStatusModel = async (status) => {
    console.log(status);
    const [result] = await pool.query(
        
        'SELECT e.* FROM employee e JOIN systemuser su ON e.employee_id = su.employee_id WHERE su.status = ?',
        [status]
    );
    //console.log(result[0]);
    return result;
};

export const updatePasswordByEmail = async (newPassword, email, table) => {
    console.log(newPassword, email, table);
    let result;
    if (table === 'employee') {
        [result] = await pool.query(
            `UPDATE systemuser s 
             JOIN employee e ON e.employee_id = s.employee_id 
             SET s.password = ? 
             WHERE e.email = ?`,
            [newPassword, email]
        );
    } else if (table === 'customer') {
        [result] = await pool.query(
            `UPDATE customer 
             SET pasword = ? 
             WHERE email = ?`,
            [newPassword, email]
        );
    }
    return result.affectedRows; // Returns the number of rows affected
};

//get all service charge data
export const getAllServiceChargeDataModel = async () => {
    const [result] = await pool.query(
`SELECT
    sc.services_charge_id,
    ae.Employee_ID AS employee_id,
    ea.event_id,
    e.name,
    e.service_charge_precentage,
    sc.amount AS base_amount,
    ROUND((sc.amount * e.service_charge_precentage / 100), 2) AS service_charge_amount,
    ea.event_date AS Date
FROM
    assigned_employee ae
JOIN
    employee e ON ae.Employee_ID = e.employee_id
JOIN
    services_charge sc ON ae.Employee_Assign_ID = sc.employee_assign_id
JOIN
    event_assigned_employee ea ON ae.Employee_Assign_ID = ea.employee_assign_id
JOIN
    event ev ON ea.event_id = ev.Event_ID;`
    );
    return result;
};
