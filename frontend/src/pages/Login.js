import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/Authcontext';
import { loginUser } from '../services/AuthService';

export const Login = () => {
    const [user, setUser] = useState({ credential: '', password: '' });
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { userEmail, id, role, token, refreshToken } = await loginUser(user);
            login(userEmail, id, role, token, refreshToken);

            if (role === 'super_admin') {
                navigate('/superAdmin');
            } else if (role === 'sub_admin') {
                navigate('/subAdmin');
            } else if (role === 'employee') {
                 
                navigate('/employee');
            } else if (role === 'customer') {
                navigate('/');
            }

        } catch (error) {
            console.error('Login error:', error); // Log the error
            const errorMessage = error?.response?.data?.message || 'Login failed';
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
        <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
            <div class="sm:mx-auto sm:w-full sm:max-w-sm">
                <img class="mx-auto h-10 w-auto" src="15.svg" alt="Your Company" />
                    <h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Sign in to your account</h2>
            </div>

            <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form class="space-y-6" action="#" method="POST" onSubmit={handleSubmit}>
                    <div>
                        <label for="email" class="block text-sm/6 font-medium text-gray-900">Email address</label>
                        <div class="mt-2">
                            <input type="text" name="credential" value={user.username} onChange={handleChange} id="email" autocomplete="email" required class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                        </div>
                    </div>

                    <div>
                        <div class="flex items-center justify-between">
                            <label for="password" class="block text-sm/6 font-medium text-gray-900">Password</label>
                            <div class="text-sm">
                                <Link to="/forgot-password" class="font-semibold text-indigo-600 hover:text-indigo-500"  >Forgot password</Link>
                                {/* <a href="#" class="font-semibold text-indigo-600 hover:text-indigo-500" >Forgot password?</a> */}
                            </div>
                        </div>
                        <div class="mt-2">
                            <input type="password" name="password" value={user.password} onChange={handleChange} id="password" autocomplete="current-password" required class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                        </div>
                    </div>

                    <div>
                        <button type="submit" class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Sign in</button>
                    </div>
                </form>

                <p class="mt-10 text-center text-sm/6 text-gray-500">
                    Not a member?
                    <a href="#" class="font-semibold text-indigo-600 hover:text-indigo-500"> Contact our community team</a>
                </p>
            </div>
        </div>

    )
}
