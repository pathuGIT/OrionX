import express from 'express';
import { superAdmin } from '../middleware/Super_admin.js';
import { addEmployee, changeUserRole, addCustomer } from '../controllers/userController.js';
import { subAdmin } from '../middleware/Sub_admin.js';

const router = express.Router();

//super admins
router.post('/addEmployee', superAdmin, addEmployee);
router.post('/addCustomer', superAdmin, addCustomer);
router.post('/changeUserRole', superAdmin, changeUserRole);
//sub admins

//employee

//customers

export default router;