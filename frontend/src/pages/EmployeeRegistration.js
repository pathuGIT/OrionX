import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerEmployee } from '../services/AuthService';

const EmployeeRegistration = () => {
    const [user, setUser] = useState({ pswd: '', employee_id: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
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
        <div>
            <h1 className=' text-xl mb-7'>Employee Registration</h1>

            <form onSubmit={handleSubmit} className='mt-2'>
                <input
                    className=' block border'
                    type="text"
                    name="employee_id" // Added name attribute
                    placeholder="emploee id"
                    value={user.employee_id}
                    onChange={handleChange} // Using generic handleChange function
                />
                <input
                    className=' block border'
                    type="password"
                    name="pswd" // Added name attribute
                    placeholder="Password"
                    value={user.pswd}
                    onChange={handleChange} // Using generic handleChange function
                />
                <button type="submit" className=' block border p-2 mt-2'>Register</button>
            </form>
        </div>
    )
}

export default EmployeeRegistration