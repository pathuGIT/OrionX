import React, { useState } from 'react';
import { getEmployeeById, updateEmployee } from '../../services/UserService'; // Ensure these functions are defined in UserService

function UpdateEmployees() {
    const [employeeId, setEmployeeId] = useState('');
    const [employee, setEmployee] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        bod: '',
        salary: '',
        hire_date: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSearch = async () => {
        try {
            const response = await getEmployeeById(employeeId);
            setEmployee(response);
            setFormData({
                name: response.name,
                phone: response.phone,
                email: response.email,
                bod: response.bod,
                salary: response.salary,
                hire_date: response.hire_date
            });
        } catch (error) {
            console.error('Error fetching employee:', error);
        }
    };

    const handleUpdate = async () => {
        try {
            await updateEmployee(employeeId, formData);
            alert('Employee updated successfully');
        } catch (error) {
            console.error('Error updating employee:', error);
        }
    };

    return (
        <div>
            <p>Update Employee</p>
            <div>
                <input
                    type="text"
                    placeholder="Enter Employee ID"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                />
                <button onClick={handleSearch}>Search</button>
            </div>
            {employee && (
                <div>
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={formData.name}
                        onChange={handleInputChange}
                    />
                    <input
                        type="text"
                        name="phone"
                        placeholder="Phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleInputChange}
                    />
                    <input
                        type="date"
                        name="bod"
                        placeholder="Date of Birth"
                        value={formData.bod}
                        onChange={handleInputChange}
                    />
                    <input
                        type="number"
                        name="salary"
                        placeholder="Salary"
                        value={formData.salary}
                        onChange={handleInputChange}
                    />
                    <input
                        type="date"
                        name="hire_date"
                        placeholder="Hire Date"
                        value={formData.hire_date}
                        onChange={handleInputChange}
                    />
                    <button onClick={handleUpdate}>Update</button>
                </div>
            )}
        </div>
    );
}

export default UpdateEmployees;