import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { registerByUserAdmin, registerByEmployee } from '../models/userModel.js';

// Register super admin only once
// export const register = async (req, res) => {
//     const { name, pswd, email, bod, contact } = req.body;

//     try {
//         //hash the pswd
//         const hashPswd = await bcrypt.hash(pswd, 10);

//         //save the admin
//         await registerByUserAdmin(name, hashPswd, email, bod, contact);
//         res.status(201).json({ msg: 'super_admin registered.' });
//     } catch (error) {
//         res.status(500).json({ msg: 'error register super_admin', error });
//     }
// }

//Register employees
export const register = async (req, res) => {

    try {
        
    } catch (error) {
        res.status(500).json({ msg: 'error register employees.', error });
    }
}


// For login
export const login = async (req, res) => {
    const { email, pswd } = req.body;

    try {
        // ...existing code...
        
    } catch (error) {
        res.status(500).json({ msg: 'error during login', error });
    }
}

export const refresh = async (req, res) => {
    try {
        // ...existing code...
        res.status(200).json({ msg: 'token refreshed' });
    } catch (error) {
        res.status(500).json({ msg: 'error during token refresh', error });
    }
}