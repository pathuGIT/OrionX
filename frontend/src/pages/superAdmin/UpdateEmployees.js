import React, { useState } from 'react';
import { getEmployeeById, updateEmployee } from '../../services/UserService'; 

function UpdateEmployees() {
    const [employeeId, setEmployeeId] = useState('');
    const [employee, setEmployee] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        bod: '',
        salary: '',
        hire_date: '',
        service_charge_precentage: ''
    });
    const [errorMessage, setErrorMessage] = useState(''); 

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSearch = async () => {
        if (!employeeId) {
            alert('Employee ID is not found');
            return;
        }

        try {
            const response = await getEmployeeById(employeeId);
            setEmployee(response);
            setFormData({
                name: response.name,
                phone: response.phone,
                email: response.email,
                bod: response.bod ? new Date(response.bod).toISOString().split('T')[0] : '',
                salary: response.salary,
                service_charge_precentage: response.service_charge_precentage,
                hire_date: response.hire_date ? new Date(response.hire_date).toISOString().split('T')[0] : ''
            });
            setErrorMessage(''); 
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setErrorMessage(error.response.data.message); // Set error message from server
            } else {
                setErrorMessage('Employee ID is not found'); // Fallback error message
            }
        }
    };

    const handleUpdate = async () => {
        try {
            await updateEmployee(employeeId, formData);
            alert('Employee updated successfully');
            setErrorMessage(''); // Clear any previous error message
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setErrorMessage(error.response.data.message); // Set error message from server
            } else {
                setErrorMessage('An unexpected error occurred.'); // Fallback error message
            }
        }
    };

    return (
        <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded-lg">
            <p className="text-xl font-semibold mb-4">Update Employee</p>
            <div>
                <input
                    type="text"
                    placeholder="Enter Employee ID"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                />
                <button onClick={handleSearch} className="mt-2 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                    Search
                </button>
            </div>
            {errorMessage && (
                <div className="mt-4 text-red-500">
                    {errorMessage}
                </div>
            )}
            {employee && (
                <div className="space-y-4 mt-4">
                    <div>
                        <h2 className="text-s font-medium">Employee name</h2>
                        <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div>
                        <h2 className="text-s font-medium">Phone number</h2>
                        <input
                            type="text"
                            name="phone"
                            placeholder="Phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div>
                        <h2 className="text-s font-medium">Email address</h2>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div>
                        <h2 className="text-s font-medium">Date of birthday</h2>
                        <input
                            type="date"
                            name="bod"
                            placeholder="Date of Birth"
                            value={formData.bod}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div>
                        <h2 className="text-s font-medium">Basic salary</h2>
                        <input
                            type="number"
                            name="salary"
                            placeholder="Salary"
                            value={formData.salary}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div>
                        <h2 className="text-s font-medium">Service charge (%)</h2>
                        <input
                            type="number"
                            name="service_charge_precentage"
                            placeholder="Service Charge (%)"
                            value={formData.service_charge_precentage}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div>
                        <h2 className="text-s font-medium">Hire date</h2>
                        <input
                            type="date"
                            name="hire_date"
                            placeholder="Hire Date"
                            value={formData.hire_date}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <button onClick={handleUpdate} className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">
                        Update
                    </button>
                </div>
            )}
        </div>
    );
}

export default UpdateEmployees;