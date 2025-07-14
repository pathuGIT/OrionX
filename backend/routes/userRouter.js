import express from 'express';
import { superAdmin } from '../middleware/Super_admin.js';
import { subAdmin } from '../middleware/Sub_admin.js';
import { customer } from '../middleware/Customer.js';
import { 
    addEmployee, 
    changeUserRole, 
    addCustomer ,
    updateEmployees,
    deleteEmployees,
    getEmployee,
    updateEmployeesStatus,
    getEmployeesByStatus,
    searchCustomer,
    getLogedUserName,
    getEmployeeById,
    serviceChargeController,
    deductionController,
    calculateAndSaveMonthlyDeduction,
    calculatePay,
    getPayEntries,
    getAllCustomers,
    updateCustomer,
    getCustomerBookings,
    notifyEmployeesPayroll,
    notifySingleEmployeePayroll,
    sendIdToEmp,
    getPaymentHistory,
    UpdatePayStatus
} from '../controllers/userController.js';

const router = express.Router();

//super admins
router.post('/addEmployee',superAdmin,  addEmployee);
router.post('/addCustomer', addCustomer);

//Add new customer with email - test
router.post('/addCustomerNew', addCustomer);


router.get('/searchCustomer', searchCustomer);
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
// Add new routes
router.get('/getAllCustomers', superAdmin, getAllCustomers);
router.put('/updateCustomer/:customerId', superAdmin, updateCustomer);
router.get('/getCustomerBookings/:customerId', superAdmin, getCustomerBookings);


router.post('/service-charges/calculate', serviceChargeController.calculateCharges);
router.get('/service-charges', serviceChargeController.getAllCharges);
router.get('/service-charges/employee/:employeeId', serviceChargeController.getEmployeeCharges);

router.post('/deductions',superAdmin, deductionController.createDeduction);
router.get('/deduction-entries',superAdmin, deductionController.getAllDeductionEntries);
router.put('/deduction-entries/:id',superAdmin, deductionController.updateDeduction);
router.delete('/deduction-entries/:id',superAdmin, deductionController.deleteDeduction);


router.post('/monthly/calculate',superAdmin, calculateAndSaveMonthlyDeduction );
router.post('/monthly/save',superAdmin, deductionController.saveMonthlyDeduction);
//router.get('/monthly/entries', deductionController.getMonthlyDeductionEntries);
router.get('/monthly/entries/:employee_id/:date',superAdmin, deductionController.getMonthlyDeductionEntriesByEmployeeAndDate);


router.post('/calculate', calculatePay);
router.get('/entries/:date',getPayEntries);
router.put('/entries/:employee_id/:date',UpdatePayStatus);

router.post('/payroll/notify',  notifyEmployeesPayroll);
router.post('/send-id-to-emp', sendIdToEmp);
router.post('/payroll/notify-employee', notifySingleEmployeePayroll);

router.get('/payment-history',   getPaymentHistory);
 


//sub admins

//employee

//customers
router.get('/getCusName', customer, getLogedUserName);

export default router;