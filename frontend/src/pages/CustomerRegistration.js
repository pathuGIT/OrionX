import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerCustomer } from '../services/AuthService';

const CustomerRegistration = () => {
    const [user, setUser] = useState({ password: '', customer_id: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { message } = await registerCustomer(user);
            console.log(message);
            navigate('/login');
        } catch (error) {
            console.error('Login error:', error); // Log the error
            const errorMessage = 'customer registration failed';
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
            <h1 className=' text-xl mb-7'>Employee Registration</h1>

            <form onSubmit={handleSubmit} className='mt-2'>
                <input
                    className=' block border'
                    type="text"
                    name="customer_id" // Added name attribute
                    placeholder="customer id"
                    value={user.customer_id}
                    onChange={handleChange} // Using generic handleChange function
                />
                <input
                    className=' block border'
                    type="password"
                    name="password" // Added name attribute
                    placeholder="Password"
                    value={user.password}
                    onChange={handleChange} // Using generic handleChange function
                />
                <button type="submit" className=' block border p-2 mt-2'>Register</button>
            </form>
        </div>
    )
}

export default CustomerRegistration