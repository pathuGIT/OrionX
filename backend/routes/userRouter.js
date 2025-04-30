import express from 'express';
import { superAdmin } from '../middleware/Super_admin.js';
import { addEmployee, changeUserRole, addCustomer ,
    updateEmployees,deleteEmployees,getEmployee,updateEmployeesStatus,getEmployeesByStatus,
    getEmployeeById,getAllServiceChargeData
} from '../controllers/userController.js';
import { subAdmin } from '../middleware/Sub_admin.js';

const router = express.Router();

//super admins
router.post('/addEmployee',superAdmin,  addEmployee);
router.post('/addCustomer', superAdmin, addCustomer);
router.post('/changeUserRole', superAdmin, changeUserRole);
router.delete('/deleteEmployee',superAdmin,deleteEmployees);
router.put('/updateStatus', updateEmployeesStatus);
router.get('/getEmployeeById/:id', superAdmin,getEmployeeById); // New route to get employee by ID
//router.put("/updateEmployee/:id", updateEmployees); // same
router.get('/getEmployees', superAdmin,getEmployee);//chage get employees
router.put('/updateEmployee',superAdmin,updateEmployees);// same
router.get('/getEmployeesByStatus', superAdmin,getEmployeesByStatus);
router.get('/getEmployeesByStatus/:status',superAdmin, getEmployeesByStatus);

router.get('/getAllServiceChargeData',superAdmin,getAllServiceChargeData);


//sub admins

//employee

//customers

export default router;