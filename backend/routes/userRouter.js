import express from 'express';
import { superAdmin } from '../middleware/Super_admin.js';
import { addEmployee, changeUserRole, addCustomer ,
    updateEmployees,deleteEmployees,getEmployee,updateEmployeesStatus,getEmployeesByStatus,
    getEmployeeById,serviceChargeController,
    deductionController,
    calculateAndSaveMonthlyDeduction
    
     
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
//router.get('/getAllServiceChargeData',handleServiceChargeOperations);
//router.get('/getAllServiceChargeData',superAdmin,getAllServiceChargeData);

router.post('/service-charges/calculate',superAdmin, serviceChargeController.calculateCharges);
router.get('/service-charges',superAdmin, serviceChargeController.getAllCharges);
router.get('/service-charges/employee/:employeeId',superAdmin, serviceChargeController.getEmployeeCharges);

router.post('/deductions',superAdmin, deductionController.createDeduction);
router.get('/deduction-entries',superAdmin, deductionController.getAllDeductionEntries);
router.put('/deduction-entries/:id',superAdmin, deductionController.updateDeduction);
router.delete('/deduction-entries/:id',superAdmin, deductionController.deleteDeduction);


router.post('/monthly/calculate',superAdmin, calculateAndSaveMonthlyDeduction );
router.post('/monthly/save',superAdmin, deductionController.saveMonthlyDeduction);
//router.get('/monthly/entries', deductionController.getMonthlyDeductionEntries);
router.get('/monthly/entries/:employee_id/:date',superAdmin, deductionController.getMonthlyDeductionEntriesByEmployeeAndDate);
 


//sub admins

//employee

//customers

export default router;