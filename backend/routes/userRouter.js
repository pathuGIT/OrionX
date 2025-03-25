import express from 'express';
import { superAdmin } from '../middleware/Super_admin.js';
import { addEmployee, changeUserRole, addCustomer ,
    updateEmployees,getEmployee,deleteEmployees,updateEmployeesStatus,
    getEmployeeById
} from '../controllers/userController.js';
import { subAdmin } from '../middleware/Sub_admin.js';

const router = express.Router();

//super admins
router.post('/addEmployee',superAdmin,  addEmployee);
router.post('/addCustomer', superAdmin, addCustomer);
router.post('/changeUserRole', superAdmin, changeUserRole);
router.get('/getEmployees', superAdmin,  getEmployee);
router.post('/updateEmployee',superAdmin,updateEmployees);
router.delete('/deleteEmployee',superAdmin,deleteEmployees);
router.post('/updateStatus',superAdmin,updateEmployeesStatus);
router.get('/getEmployeeById/:id', superAdmin, getEmployeeById); // New route to get employee by ID
router.put('/updateEmployee/:id', superAdmin, updateEmployees); // Changed to PUT for updating employee

//sub admins

//employee

//customers

export default router;