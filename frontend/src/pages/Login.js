import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/Authcontext';
import { loginUser } from '../services/AuthService';

export const Login = () => {
    const [user, setUser] = useState({ credintial: '', pswd: '' });
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
                navigate('/customer');
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
        <div>
            <h1 className=' text-xl mb-7'>Login</h1>

            <form onSubmit={handleSubmit} className='mt-2'>
                <input
                    className=' block border'
                    type="text"
                    name="credintial" // Added name attribute
                    placeholder="Username"
                    value={user.username}
                    onChange={handleChange} // Using generic handleChange function
                />
                <input
                    className=' block border'
                    type="password"
                    name="pswd" // Added name attribute
                    placeholder="Password"
                    value={user.password}
                    onChange={handleChange} // Using generic handleChange function
                />
                <button type="submit" className=' block border p-2 mt-2'>Login</button>
            </form>
        </div>
    )
}
