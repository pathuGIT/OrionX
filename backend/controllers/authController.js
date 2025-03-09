import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getUserByUserEmailORPswdModel, registerSuperAdminSystemUserModel, getSystemUserByEmpIdModel, registerSystemUserModel } from '../models/userModel.js';
import { saveRefreshTokenModel, isRefreshTokenValidModel } from '../models/authModule.js';


//Register employee 
export const registerEmp = async (req, res) => {
    const { pswd, employee_id } = req.body;
    try {
        const userAlreadyExist = await getSystemUserByEmpIdModel(employee_id);
        if (userAlreadyExist) return res.status(400).json({ message: 'This User already exist...' });

        const hashedPassword = await bcrypt.hash(pswd, 10);
        //await registerSuperAdminSystemUserModel(hashedPassword, employee_id);
        await registerSystemUserModel(hashedPassword, employee_id);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ msg: 'error register employees.', error });
    }
}
//Register customer 
export const registerCus = async (req, res) => {
    const { password, customer_id } = req.body;
    try {
        const userAlreadyExist = await getCustomersByCusIdModel(employee_id);
        if (userAlreadyExist) return res.status(400).json({ message: 'This User already exist...' });

        const hashedPassword = await bcrypt.hash(password, 10);
        await registerSystemUserModel(hashedPassword, customer_id);
        res.status(201).json({ message: 'Customer registered successfully' });
    } catch (error) {
        res.status(500).json({ msg: 'error register customer.', error });
    }
}

// For login
export const login = async (req, res) => {
    const { credintial, pswd } = req.body;
    //const user = null;

    try {
        // Fetch user by email or contact no
        const user = await getUserByUserEmailORPswdModel(credintial);
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        // Compare passwords
        const isMatch = await bcrypt.compare(pswd, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Password not matched.' });

        // Generate JWT
        const token = jwt.sign({ useId: user.user_id, userEmail: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '2m' });
        const refreshToken = jwt.sign({ useId: user.user_id, userEmail: user.email, role: user.role }, process.env.JWT_REFRESH, { expiresIn: '1h' });

        console.log(user.user_id + user.role);
        await saveRefreshTokenModel(refreshToken, user.user_id);
        res.status(200).json({ message: 'Login successful', userEmail: user.email, id: user.user_id, role: user.role, token, refreshToken });
    } catch (error) {
        res.status(500).json({ msg: 'error during login', error });
    }
}

export const refresh = async (req, res) => {
    const refreshToken = req.body.refreshKey;

    if (!refreshToken) return res.sendStatus(401);

    // Assuming you have a way to get the user ID from the refresh token
    const decodedRToken = jwt.decode(refreshToken);
    const userId = decodedRToken?.useId;

    if (!userId || !(await isRefreshTokenValidModel(userId, refreshToken))) {
        console.error('Invalid refresh token');
        return res.sendStatus(403);
    }

    jwt.verify(refreshToken, process.env.JWT_REFRESH, async (err, user) => {
        if (err) return res.status(403).json({ message: "Refresh token not verified." });

        // Access user.id and user.role from the decoded token
        const { useId, userEmail, role } = user;

        const token = jwt.sign({ useId: useId, userEmail: userEmail, role: role }, process.env.JWT_SECRET, { expiresIn: '2m' });

        res.status(200).json({ message: 'Token refreshed', userEmail: user.email, id: user.id, role: user.roles, token });
    });

}