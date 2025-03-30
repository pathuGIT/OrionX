import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerEmployee } from '../services/AuthService';

const EmployeeRegistration = () => {
    const [user, setUser] = useState({ pswd: '', employee_id: '' });
    const [confirmPswd, setConfirmPswd] = useState('');
    const navigate = useNavigate();

    const handleConfirmChange = (e) => {
        setConfirmPswd(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (user.pswd !== confirmPswd) {
            alert('Passwords do not match');
            return;
        }
        try {
            const { message } = await registerEmployee(user);
            console.log(message);
            navigate('/login');
        } catch (error) {
            console.error('Login error:', error); // Log the error
            const errorMessage = 'employee registration failed';
            alert(errorMessage);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };

    return (
        <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 bg-[#0a1633]">
            <div class="sm:mx-auto sm:w-full sm:max-w-sm">
                {/* <img class="mx-auto h-10 w-auto" src="" alt="Your Company" /> */}
                    <h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">Sign up to your employee account</h2>
            </div>

            <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form class="space-y-6" action="#" method="POST" onSubmit={handleSubmit} >
                    <div>
                        <label for="text" class="block text-sm/6 font-medium text-white">Registartion Id</label>
                        <div class="mt-2">
                            <input type="text" name="employee_id" id="email" placeholder="emploee id" value={user.employee_id} onChange={handleChange}  required class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                        </div>
                    </div>

                    <div>
                        <div class="flex items-center justify-between">
                            <label for="password" class="block text-sm/6 font-medium text-white">Password</label>
                        </div>
                        <div class="mt-2">
                            <input type="password" name="pswd" id="password" placeholder="Password" value={user.pswd} onChange={handleChange} required class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                        </div>
                    </div>

                    <div>
                        <div class="flex items-center justify-between">
                            <label for="confirm-password" class="block text-sm/6 font-medium text-white">Confirm Password</label>
                        </div>
                        <div class="mt-2">
                            <input type="password" name="confirmPswd" id="confirm-password" placeholder="Confirm Password" value={confirmPswd} onChange={handleConfirmChange} required class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                        </div>
                    </div>

                    <div>
                        <button type="submit" class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Sign up</button>
                    </div>
                </form>

                <p class="mt-10 text-center text-sm/6 text-gray-500">
                    Could not register?
                    <a href="#" class="font-semibold text-indigo-600 hover:text-indigo-500"> Contact us</a>
                </p>
            </div>
        </div>
    )
}

export default EmployeeRegistration