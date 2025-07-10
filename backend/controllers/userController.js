import {
  addEmployeeModel,
  getEmployeeByEmailModel,
  getEmployeeByPhoneModel,
  getEmployeeModel,
  updateUserRoleModel,
  updateEmployeesModel,
  getEmployeeByuserIdModel,
  getEmployeesByStatusModel,
  deleteEmployeesModel,
  updateEmployeesStatusModel,
  ServiceChargeModel,
  checkUserIsActive,
  searchCustomerByTerm,
  DeductionModel,
  calculatePayModel,
  getPayEntriesModel,
  
  
} from "../models/userModel.js";
import pool from "../config/db.js";

import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();


import { sendIdToUserMethod } from "../controllers/mailController.js";
import {
  getCustomerByEmailModel,
  getCustomerByPhoneModel,
  addCustomerModel,
  getCusName,
  getAllCustomersModel,
  updateCustomerModel,
  getBookingsByCustomerIdModel,
} from "../models/customerModel.js";

//...........................................................................

// Create reusable transporter object
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAIL_ADDRESS,
    pass: process.env.MAIL_PSWD,
  },
});

// Send ID to employee
export const sendIdToEmp = async (req, res) => {
  const { name, subject, email, message } = req.body;

  try {
    const mailOptions = {
      from: `"Deandra" <${process.env.MAIL_ADDRESS}>`,
      to: email,
      subject,
      text: `Hello ${name},\n\n${message}`,
      html: `<p>Hello ${name},</p><p>${message}</p>`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ 
      msg: 'Failed to send email',
      error: error.message 
    });
  }
};

// Send salary notification to employee
export const sendSalaryEmail = async (name, email, netSalary, month, deductions) => {
  const subject = `Your Salary Statement - ${month}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2c3e50;">Dear ${name},</h2>
      <p>Your salary for <strong>${month}</strong> has been processed:</p>
      
      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px;">
        <h3 style="color: #27ae60;">Salary Details</h3>
        <p><strong>Net Salary:</strong> LKR ${netSalary.toLocaleString('en-US', {minimumFractionDigits: 2})}</p>
        <p><strong>Total Deductions:</strong> LKR ${deductions.toLocaleString('en-US', {minimumFractionDigits: 2})}</p>
        <p><strong>Payment Date:</strong> ${new Date().toLocaleDateString()}</p>
      </div>
      
      <p>If you have any questions about your salary, please contact the HR department.</p>
      
      <p style="margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
        <small>This is an automated message. Please do not reply directly to this email.</small>
      </p>
      
      <p>Best regards,<br>The Payroll Team<br>Deandra Management</p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Deandra Payroll" <${process.env.MAIL_ADDRESS}>`,
      to: email,
      subject,
      html
    });
    return true;
  } catch (error) {
    console.error(`Failed to send salary email to ${email}:`, error);
    return false;
  }
};

// Notify employees about payroll
export const notifyEmployeesPayroll = async (req, res) => {
  const { date } = req.body;
  
  try {
    const payEntries = await getPayEntriesModel(date);
    
    if (!payEntries?.length) {
      return res.status(404).json({ 
        success: false,
        message: "No payroll data found for the specified date" 
      });
    }

    const results = [];
    for (const entry of payEntries) {
      try {
        const employee = await getEmployeeByuserIdModel(entry.employee_id);
        if (employee?.email) {
          const emailSent = await sendSalaryEmail(
            employee.name,
            employee.email,
            entry.net_salary,
            date,
            entry.total_deduction
          );
          
          results.push({
            employee_id: entry.employee_id,
            status: emailSent ? 'success' : 'failed',
            message: emailSent ? 'Email sent' : 'Failed to send email'
          });
        } else {
          results.push({
            employee_id: entry.employee_id,
            status: 'failed',
            message: 'Employee email not found'
          });
        }
      } catch (error) {
        results.push({
          employee_id: entry.employee_id,
          status: 'failed',
          message: error.message
        });
      }
    }
    
    const successCount = results.filter(r => r.status === 'success').length;
    
    res.status(200).json({ 
      success: true,
      message: `Salary notifications sent to ${successCount}/${payEntries.length} employees`,
      results
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: "Failed to send notifications",
      details: error.message 
    });
  }
};
export const notifySingleEmployeePayroll = async (req, res) => {
  const { date, employeeId } = req.body;
  
  try {
    const payEntry = await getPayEntryByEmployeeAndDateModel(employeeId, date);
    
    if (!payEntry) {
      return res.status(404).json({ 
        success: false,
        message: "Payroll data not found for the specified employee and date" 
      });
    }

    const employee = await getEmployeeByuserIdModel(employeeId);
    if (!employee?.email) {
      return res.status(404).json({
        success: false,
        message: "Employee email not found"
      });
    }

    const emailSent = await sendSalaryEmail(
      employee.name,
      employee.email,
      payEntry.net_salary,
      date,
      payEntry.total_deduction
    );

    res.status(200).json({
      success: true,
      message: emailSent ? 'Email sent successfully' : 'Failed to send email',
      employee_id: employeeId,
      status: emailSent ? 'success' : 'failed'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: "Failed to send notification",
      details: error.message 
    });
  }
};

  //....................................

//add employees (employees add to system by admin)
export const addEmployee = async (req, res) => {
  const { name, phone, email, bod, serviceCharge, salary } = req.body;
  try {
    const checkPhone = await getEmployeeByPhoneModel(phone);
    if (checkPhone)
      return res.status(400).json({ message: "Phone already exist..." });

    const checkEmail = await getEmployeeByEmailModel(email);
    if (checkEmail)
      return res.status(400).json({ message: "Email already exist..." });

    if (serviceCharge == null) serviceCharge = 0;
    await addEmployeeModel(name, phone, email, bod, serviceCharge, salary);

    const user = await getEmployeeByEmailModel(email);
    await sendIdToUserMethod(
      name,
      "Deandra Registration",
      email,
      user.employee_id,
      "http://localhost:3000/registration/register-employee"
    );

    res
      .status(201)
      .json({
        message: `User registered successfully and User ID sent to email: ${email}`,
      });
  } catch (error) {
    res.status(500).json({ msg: "Server error...", error });
  }
};

// add new customer
export const addCustomer = async (req, res) => {
    const { name, email, address, phone } = req.body;
    try {
        const checkPhone = await getCustomerByPhoneModel(phone);
        if (checkPhone) return res.status(400).json({ message: 'Phone already exist...' });

        const checkEmail = await getCustomerByEmailModel(email);
        if (checkEmail) return res.status(400).json({ message: 'Email already exist...' });

        const customer = await addCustomerModel(name, email, address, phone);

        const user = await getCustomerByEmailModel(email);
        await sendIdToUserMethod(name, "Deandra Registration", email, user.customer_id, 'http://localhost:3000/registration/register-customer');
        
        console.log(`User ID sent to: ${customer}`);
        res.status(201).json({ message: `User registered successfully with this '${email}' email.`, cus_id: customer });

    } catch (error) {
        res.status(500).json({ msg: 'Server error...', error });
    }
}

// change user role
export const changeUserRole = async (req, res) => {
  const { userId, role } = req.body;
  try {
    const userStatus = await checkU4serIsActive(userId);
    if (userStatus && userStatus.status === "active") {
      await updateUserRoleModel(userId, role);
      res.status(200).json({ message: "User role updated successfully" });
    } else {
      res.status(400).json({ message: "User is not active or does not exist" });
    }
  } catch (error) {
    res.status(500).json({ msg: "Server error...", error });
  }
};

//get employees data
export const getEmployee = async (req, res) => {
    try{
        const result = await getEmployeeModel();
        result.forEach(employee => console.log(employee.bod));
        res.status(201).json({ employees: result });
        
    }catch(error){
        res.status(500).json({ msg: 'Server error...', error });
    } 
}

// Update the existing searchCustomer controller
export const searchCustomer = async (req, res) => {
  try {
    const searchTerm = req.query.q;
    if (!searchTerm || searchTerm.trim() === '') {
      return res.status(400).json({ error: 'Search term is required' });
    }
    
    const results = await searchCustomerByTerm(searchTerm.trim());
    res.json(results);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Failed to perform search' });
  }
};

// update employee details
// export const updateEmployees = async (req, res) => {
//     const { employee_id, name, phone, email, bod, salary, hire_date} = req.body;
//     try {
//         const checkUserId = await getEmployeeByuserIdModel(employee_id);
//         if (checkUserId.employee_id !== employee_id) return res.status(400).json({ message: 'User ID does not exist' });

//         await updateEmployeesModel(employee_id, name, phone, email, bod, salary, hire_date);

//         res.status(200).json({ message: 'Employee updated successfully' });
//     } catch (error) {
//         res.status(500).json({ msg: 'Server error...', error });
//     }
// };

// delete employee
export const deleteEmployees = async (req, res) => {
  const { employee_id } = req.body;
  try {
    const checkUserId = await getEmployeeByuserIdModel(employee_id);
    if (checkUserId.employee_id !== employee_id)
      return res.status(400).json({ message: "User ID does not exist" });

    await deleteEmployeesModel(employee_id);

    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server error...", error });
  }
};

// update employee(systemuser) status
export const updateEmployeesStatus = async (req, res) => {
  const { employee_Id, status } = req.body;

  try {
    const checkUserId = await getEmployeeByuserIdModel(employee_Id);
    if (!checkUserId) {
      return res.status(400).json({ message: "User ID does not exist" });
    }

    await updateEmployeesStatusModel(employee_Id, status);

    res.status(200).json({ message: "Employee status updated successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server error...", error });
  }
};

// Get employee by ID
export const getEmployeeById = async (req, res) => {
  const { id } = req.params;

  try {
    const employee = await getEmployeeByuserIdModel(id);
    if (!employee)
      return res.status(404).json({ message: "Employee not found" });
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ msg: "Server error...", error });
  }
};

// update employee details
export const updateEmployees = async (req, res) => {
  const {
    id,
    name,
    phone,
    email,
    bod,
    salary,
    service_charge_precentage,
    hire_date,
  } = req.body;
  try {
    //const checkUserId = await getEmployeeByuserIdModel(id);
    //if (!checkUserId) return res.status(400).json({ message: 'User ID does not exist' });
    console.log(
      id,
      name,
      phone,
      email,
      bod,
      salary,
      service_charge_precentage,
      hire_date
    )
    await updateEmployeesModel(
      id,
      name,
      phone,
      email,
      bod,
      salary,
      service_charge_precentage,
      hire_date
    );

    res.status(200).json({ message: "Employee updated successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server error...", error });
  }
};

// Get employees by status
export const getEmployeesByStatus = async (req, res) => {
  const { status } = req.params;
  try {
    const employees = await getEmployeesByStatusModel(status);
    res.status(200).json({ employees });
  } catch (error) {
    res.status(500).json({ msg: "Server error...", error });
  }
};
//////////////////////////////////////////////////////////////////////////////

export const serviceChargeController = {
  calculateCharges: async (req, res) => {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      
      // Validate existing bookings
      const [validation] = await connection.query(
        `SELECT COUNT(*) AS valid_events 
         FROM booking 
         WHERE status = 'done' 
         AND total_price > 0`
      );

      if (validation[0].valid_events === 0) {
        return res.status(400).json({
          success: false,
          message: "No valid events available for calculation"
        });
      }

      // Execute calculation
      const [result] = await connection.query("CALL CalculateServiceCharges()");
      
      // Get affected rows
      const [affected] = await connection.query(
        "SELECT ROW_COUNT() AS affectedRows"
      );

      await connection.commit();

      res.json({
        success: true,
        message: "Service charges calculated successfully",
        affectedRows: affected[0].affectedRows
      });
    } catch (error) {
      await connection.rollback();
      res.status(500).json({
        success: false,
        message: "Service charge calculation failed",
        error: error.message
      });
    } finally {
      connection.release();
    }
  },

  getAllCharges: async (req, res) => {
    try {
      const charges = await ServiceChargeModel.getAllCharges();
      
      if (!charges?.length) {
        return res.status(404).json({
          success: false,
          message: "No service charge records found"
        });
      }

      // Transform data for response
      const transformed = charges.map(charge => ({
        ...charge,
        service_charge_id: charge.service_charge_id.replace('EVN', 'EVI'),
        event_budget: `LKR ${charge.event_budget.toLocaleString('en-US')}`
      }));

      res.json({
        success: true,
        count: transformed.length,
        data: transformed
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to retrieve service charges",
        error: error.message
      });
    }
  },

  getEmployeeCharges: async (req, res) => {
    try {
      const { employeeId } = req.params;
      
      if (!/^EMP\d{6}$/.test(employeeId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid employee ID format"
        });
      }

      const charges = await ServiceChargeModel.getEmployeeCharges(employeeId);
      
      if (!charges?.length) {
        return res.status(404).json({
          success: false,
          message: "No charges found for this employee"
        });
      }

      res.json({
        success: true,
        count: charges.length,
        data: charges
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to retrieve employee charges",
        error: error.message
      });
    }
  }
};

/////////////////////////////////////////////////////////////////////
// Get historical service charge calculations
export const getServiceChargeHistory = async (req, res) => {
  try {
    const [history] = await pool.query(`
            SELECT * FROM service_charge_calculations
            ORDER BY calculation_date DESC
            LIMIT 50
        `);

    res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error) {
    console.error("Get history error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve service charge history",
    });
  }
};

// Save service charge calculation
export const saveServiceChargeCalculation = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const calculationData = req.body;

    await connection.beginTransaction();

    // Save main calculation
    const [result] = await connection.query(
      `
            INSERT INTO service_charge_calculations (
                total_collected,
                total_weighted_employees,
                base_rate,
                grand_total,
                calculation_date
            ) VALUES (?, ?, ?, ?, NOW())
        `,
      [
        calculationData.totalCollectedServiceCharge,
        calculationData.totalWeightedEmployees,
        calculationData.baseRate,
        calculationData.grandTotal,
      ]
    );

    // Save distribution details
    for (const category of calculationData.distribution) {
      await connection.query(
        `
                INSERT INTO service_charge_distribution (
                    calculation_id,
                    category,
                    employee_count,
                    per_employee_amount,
                    total_for_category
                ) VALUES (?, ?, ?, ?, ?)
            `,
        [
          result.insertId,
          category.category,
          category.numberOfEmployees,
          category.perEmployeeAmount,
          category.totalForCategory,
        ]
      );
    }

    await connection.commit();

    res.status(201).json({
      success: true,
      message: "Calculation saved successfully",
    });
  } catch (error) {
    await connection.rollback();
    console.error("Save calculation error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to save service charge calculation",
    });
  } finally {
    connection.release();
  }
};

// Get loged user name
export const getLogedUserName = async (req, res) => {
  const userId = req.query.id;
  try {
    const customer = await getCusName(userId);
    if (!customer) return res.status(404).json({ message: "Customer not found" });
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ msg: "Server error...", error });
  }
};


//deduction.............




export const deductionController = {createDeduction: async (req, res) => {
    try {
      const { calculation_date, description, employee_id, amount } = req.body;
      await DeductionModel.createDeduction(
        calculation_date,
        description,
        employee_id,
        amount
      );
      res.json({ success: true});
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  getAllDeductionEntries: async (req, res) => {
    try {
      const entries = await DeductionModel.getAllDeductionEntries();
      res.json({ success: true, data: entries });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

 // updatededuction..................................
  updateDeduction: async (req, res) => {
    try {
      const { id } = req.params;
      const { calculation_date, description, employee_id, amount } = req.body;
  
      const updated = await DeductionModel.updateDeduction(
        id,
        calculation_date,
        description,
        employee_id,
        amount
      );
  
      if (updated) {
        res.json({ success: true, message: 'Deduction updated successfully' });
      } else {
        res.status(404).json({ success: false, message: 'Deduction not found' });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // userController.js
deleteDeduction: async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await DeductionModel.deleteDeduction(id);
    if (deleted) {
      res.json({ success: true, message: 'Deduction deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Deduction not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
},



calculateMonthlyDeduction: async (req, res) => {
  try {
      const { employee_id, month_year } = req.body;
      const result = await DeductionModel.calculateAndSaveMonthlyDeduction(employee_id, month_year);
      res.status(200).json(result);
  } catch (error) {
      res.status(500).json({ 
          success: false, 
          message: error.message 
      });
  }
},
saveMonthlyDeduction: async (req, res) => {
  try {
      const result = await DeductionModel.saveMonthlyDeduction(req.body);
      res.status(201).json(result);
  } catch (error) {
      res.status(500).json({ 
          success: false, 
          message: error.message 
      });
  }
},
//..........................................................

getMonthlyDeductionEntriesByEmployeeAndDate: async (req, res) => {
  try {
    const { employee_id, date } = req.params;

    console.log("Request Parameters:", employee_id, date); // Log request parameters
    const entries = await DeductionModel.getMonthlyDeductionSummaryByEmployeeAndDate(employee_id, date);

    if (!entries || entries.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No deduction entries found for the specified employee and date",
      });
    }

    res.status(200).json({
      success: true,
      data: entries,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}


 
  
};




export const calculateAndSaveMonthlyDeduction = async (req, res) => {
  try {
    const { employee_id, month_year } = req.body;
    
    const success = await DeductionModel.calculateAndSaveMonthlyDeductionmodel(
      employee_id,
      month_year
    );

    if (success) {
      res.status(200).json({
        success: true,
        message: 'Monthly deduction calculated and saved successfully'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'No deductions found for this period'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

//........................pay
export const calculatePay = async (req, res) => {
  try {
    const { calculation_date } = req.body;
    const result = await calculatePayModel(calculation_date);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPayEntries = async (req, res) => {
  try {
    const { date } = req.params;
    const entries = await getPayEntriesModel(date);
    res.status(200).json(entries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Add new controller methods
export const getAllCustomers = async (req, res) => {
  try {
    const customers = await getAllCustomersModel();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
};

export const updateCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;
    const { name, email, phone, address, staus } = req.body;
    
    // Validate required fields
    if (!name || !email || !phone) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const updateData = {
      name,
      email,
      phone,
      address: address || '',
      staus: staus || 'active'
    };

    const updatedCustomer = await updateCustomerModel(customerId, updateData);
    res.json(updatedCustomer);
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ error: 'Failed to update customer' });
  }
};

export const getCustomerBookings = async (req, res) => {
  try {
    const { customerId } = req.params;
    const bookings = await getBookingsByCustomerIdModel(customerId);
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};
 
