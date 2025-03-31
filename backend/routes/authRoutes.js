import express from 'express';
import {registerCus, registerEmp, login, refresh, checkEmail } from '../controllers/authController.js';
const router = express.Router();

router.post('/register-employee', registerEmp);
router.post('/register-customer', registerCus);
router.post('/login', login);
router.post('/refresh', refresh);
router.get('/check-email', checkEmail);



export default router;
