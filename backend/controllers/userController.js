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

import { sendIdToUserMethod } from "../controllers/mailController.js";
import {
  getCustomerByEmailModel,
  getCustomerByPhoneModel,
  addCustomerModel,
  getCusName,
} from "../models/customerModel.js";

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

export const searchCustomer = async (req, res) => {
    const search_term = req.query.q;
    
    try {
        const customers = await searchCustomerByTerm(search_term);
        if (!customers || customers.length === 0) return res.status(404).json({ message: 'Customer not found' });
        res.status(200).json({ customers });
        
    } catch (error) {
        res.status(500).json({ msg: 'Server error...', error });
    }
}

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
    try {
      const result = await ServiceChargeModel.calculateServiceCharges();
      res.json({
        success: true,
        message: result.message,
        affectedRows: result.affectedRows
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Service charge calculation failed",
        error: error.message
      });
    }
  },

  getAllCharges: async (req, res) => {
    try {
      const charges = await ServiceChargeModel.getAllCharges();
      
      if (!charges || charges.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No service charge records found"
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
        message: "Failed to retrieve service charges",
        error: error.message
      });
    }
  },

  getEmployeeCharges: async (req, res) => {
    try {
      const { employeeId } = req.params;
      const charges = await ServiceChargeModel.getEmployeeCharges(employeeId);
      
      if (!charges || charges.length === 0) {
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

 
