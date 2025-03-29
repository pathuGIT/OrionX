import express from 'express';
import { superAdmin } from '../middleware/Super_admin.js';
import { addEmployee, changeUserRole, addCustomer ,
    updateEmployees,getEmployee,deleteEmployees,updateEmployeesStatus,getEmployeesByStatus,
    getEmployeeById
} from '../controllers/userController.js';
import { subAdmin } from '../middleware/Sub_admin.js';

const router = express.Router();

//super admins
router.post('/addEmployee',superAdmin,  addEmployee);
router.post('/addCustomer', superAdmin, addCustomer);
router.post('/changeUserRole', superAdmin, changeUserRole);
router.delete('/deleteEmployee',superAdmin,deleteEmployees);
router.put('/updateStatus', superAdmin, updateEmployeesStatus);
router.get('/getEmployeeById/:id', superAdmin, getEmployeeById); // New route to get employee by ID
router.put('/updateEmployee/:id', superAdmin, updateEmployees); // Changed to PUT for updating employee
router.get('/getEmployees', getEmployee);
router.post('/updateEmployee',updateEmployees);
router.get('/getEmployeesByStatus', getEmployeesByStatus);

//sub admins

//employee

//customers

export default router;