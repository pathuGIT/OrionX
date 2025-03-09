import express from 'express';
import { sendIdToEmp } from '../controllers/mailController.js';
const router = express.Router();

//super admins
router.post('/sendEmpId', sendIdToEmp);

//sub admins

//employee

//customers
export default router;