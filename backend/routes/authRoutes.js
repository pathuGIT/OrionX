import express from 'express';
import {registerCus, registerEmp, login, refresh, checkEmail, forgotPassword, validateOtp } from '../controllers/authController.js';
const router = express.Router();

router.post('/register-employee', registerEmp);
router.post('/register-customer', registerCus);
router.post('/login', login);
router.post('/refresh', refresh);
router.get('/check-email', checkEmail);
// router.post('/add-otp', addOtp);//--------otp
// router.delete('/delete-otp', deleteOtp);//--------------otp
// router.get('/get-otp', getOtpByEmail); //-----------otp
router.post('/forgot-password', forgotPassword);
router.post('/validate-otp', validateOtp);



export default router;
