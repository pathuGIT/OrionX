
import { 
    addEmployeeModel, 
    getEmployeeByEmailModel, 
    getEmployeeByPhoneModel,
    getEmployeeModel,
    updateUserRoleModel,
    updateEmployeesModel,
    getEmployeeByuserIdModel,
    deleteEmployeesModel,
    updateEmployeesStatusModel,
    checkUserIsActive} from '../models/userModel.js';
import { sendIdToUserMethod, } from '../controllers/mailController.js';
import { getCustomerByEmailModel, getCustomerByPhoneModel, addCustomerModel } from '../models/customerModel.js';

//add employees (employees add to system by admin)
export const addEmployee = async (req, res) => {
    const { name, phone, email, bod, serviceCharge, salary } = req.body;
    try {
        const checkPhone = await getEmployeeByPhoneModel(phone);
        if (checkPhone) return res.status(400).json({ message: 'Phone already exist...' });

        const checkEmail = await getEmployeeByEmailModel(email);
        if (checkEmail) return res.status(400).json({ message: 'Email already exist...' });

        if(serviceCharge == null) serviceCharge = 0;
        await addEmployeeModel(name, phone, email, bod, serviceCharge, salary);

        const user = await getEmployeeByEmailModel(email);
        await sendIdToUserMethod(name, "Deandra Registration", email, user.employee_id, 'http://localhost:3000/registration/register-employee');

        res.status(201).json({ message: `User registered successfully and User ID sent to email: ${email}` });

    } catch (error) {
        res.status(500).json({ msg: 'Server error...', error });
    }
};

// add new customer 
export const addCustomer = async (req, res) => {
    const { name, email, address, phone } = req.body;
    try {
        const checkPhone = await getCustomerByPhoneModel(phone);
        console.log(checkPhone)
        if (checkPhone) return res.status(400).json({ message: 'Phone already exist...' });

        const checkEmail = await getCustomerByEmailModel(email);
        if (checkEmail) return res.status(400).json({ message: 'Email already exist...' });

        await addCustomerModel(name, email, address, phone);

        const user = await getCustomerByEmailModel(email);
        await sendIdToUserMethod(name, "Deandra Registration", email, user.customer_id, 'http://localhost:3000/registration/register-customer');

        res.status(201).json({ message: `User registered successfully and User ID sent to email: ${email}` });

    } catch (error) {
        res.status(500).json({ msg: 'Server error...', error });
    }
}

// change user role
export const changeUserRole = async (req, res) => {
    const { userId, role } = req.body;
    try{
        const userStatus = await checkU4serIsActive(userId);
        if (userStatus && userStatus.status === 'active') {
            await updateUserRoleModel(userId, role);
            res.status(200).json({ message: 'User role updated successfully' });
        } else {
            res.status(400).json({ message: 'User is not active or does not exist' });
        }
        
    }catch(error){
        res.status(500).json({msg: 'Server error...', error })
    }
}

// get employees data
export const getEmployee = async (req, res) => {
    try{
        const result = await getEmployeeModel();
        res.status(201).json({ employees: result });
    }catch(error){
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
        if (checkUserId.employee_id !== employee_id) return res.status(400).json({ message: 'User ID does not exist' });

        await deleteEmployeesModel(employee_id);

        res.status(200).json({ message: 'Employee deleted successfully' });
    } catch (error) {
        res.status(500).json({ msg: 'Server error...', error });
    }
};

// update employee(systemuser) status
export const updateEmployeesStatus = async (req, res) => {
    const { employee_id, status } = req.body;
    try {
        const checkUserId = await getEmployeeByuserIdModel(employee_id);
        if (checkUserId.employee_id !== employee_id) return res.status(400).json({ message: 'User ID does not exist' });

        await updateEmployeesStatusModel(employee_id, status);

        res.status(200).json({ message: 'Employee status updated successfully' });
    } catch (error) {
        res.status(500).json({ msg: 'Server error...', error });
    }
};

// Get employee by ID
export const getEmployeeById = async (req, res) => {
    const { id } = req.params;
    try {
        const employee = await getEmployeeByuserIdModel(id);
        if (!employee) return res.status(404).json({ message: 'Employee not found' });
        res.status(200).json(employee);
    } catch (error) {
        res.status(500).json({ msg: 'Server error...', error });
    }
};

 // update employee details
export const updateEmployees = async (req, res) => {
    const { id } = req.params;
    const { name, phone, email, bod, salary, service_charge_precentage, hire_date } = req.body;
    try {
        const checkUserId = await getEmployeeByuserIdModel(id);
        if (!checkUserId) return res.status(400).json({ message: 'User ID does not exist' });

        await updateEmployeesModel(id, name, phone, email, bod, salary, service_charge_precentage, hire_date);

        res.status(200).json({ message: 'Employee updated successfully' });
    } catch (error) {
        res.status(500).json({ msg: 'Server error...', error });
    }
};