import express from 'express';
import {registerCus, registerEmp, login, refresh } from '../controllers/authController.js';
const router = express.Router();

router.post('/register-employee', registerEmp);
router.post('/register-customer', registerCus);
router.post('/login', login);
router.post('/refresh', refresh);


export default router;
