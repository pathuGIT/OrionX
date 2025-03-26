import React, { useState, useEffect } from 'react';
import { getEmployees, getEmployeeById, updateEmployee, deleteEmployees } from '../../services/UserService';

function UpdateEmployees() {
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
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
    const [showPopup, setShowPopup] = useState(false);
    const [showActionPopup, setShowActionPopup] = useState(false);

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const response = await getEmployees();
            setEmployees(response.employees);
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleEdit = async (employeeId) => {
        try {
            const response = await getEmployeeById(employeeId);
            setSelectedEmployee(response);
            setFormData({
                name: response.name,
                phone: response.phone,
                email: response.email,
                bod: response.bod ? new Date(response.bod).toISOString().split('T')[0] : '',
                salary: response.salary,
                service_charge_precentage: response.service_charge_precentage,
                hire_date: response.hire_date ? new Date(response.hire_date).toISOString().split('T')[0] : ''
            });
            setShowPopup(true);
        } catch (error) {
            console.error('Error fetching employee:', error);
        }
    };

    const handleUpdate = async () => {
        try {
            await updateEmployee(selectedEmployee.employee_id, formData);
            alert('Employee updated successfully');
            setShowPopup(false);
            fetchEmployees();
        } catch (error) {
            console.error('Error updating employee:', error);
            setErrorMessage('An unexpected error occurred.');
        }
    };

    const handleDelete = async (employeeId) => {
        try {
            await deleteEmployees(employeeId);
            alert('Employee deleted successfully');
            fetchEmployees();
        } catch (error) {
            console.error('Error deleting employee:', error);
            setErrorMessage('An unexpected error occurred.');
        }
    };

    const handleActionClick = (employeeId) => {
        setSelectedEmployee(employeeId);
        setShowActionPopup(true);
    };

    return (
        <div className="max-w-4xl mx-auto p-4 bg-white shadow-md rounded-lg">
            <p className="text-xl font-semibold mb-4">Update Employees</p>
            <table className="min-w-full bg-white">
                <thead>
                    <tr>
                        <th className="py-1 px-2 w-20">Employee ID</th>
                        <th className="py-1 px-2 w-32">Name</th>
                        <th className="py-1 px-2 w-32">Phone</th>
                        <th className="py-1 px-2 w-40">Email</th>
                        <th className="py-1 px-2 w-32">Date of Birth</th>
                        <th className="py-1 px-2 w-24">Salary</th>
                        <th className="py-1 px-2 w-32">Service Charge (%)</th>
                        <th className="py-1 px-2 w-32">Hire Date</th>
                        <th className="py-1 px-2 w-24">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map((employee) => (
                        <tr key={employee.employee_id}>
                            <td className="py-1 px-2">{employee.employee_id}</td>
                            <td className="py-1 px-2">{employee.name}</td>
                            <td className="py-1 px-2">{employee.phone}</td>
                            <td className="py-1 px-2">{employee.email}</td>
                            <td className="py-1 px-2">{employee.bod}</td>
                            <td className="py-1 px-2">{employee.salary}</td>
                            <td className="py-1 px-2">{employee.service_charge_precentage}</td>
                            <td className="py-1 px-2">{employee.hire_date}</td>
                            <td className="py-1 px-2">
                                <button onClick={() => handleActionClick(employee.employee_id)} className="bg-blue-500 text-white px-2 py-1 rounded">Actions</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showActionPopup && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-4 rounded-lg shadow-lg">
                        <h2 className="text-xl font-semibold mb-4">Employee Actions</h2>
                        <div className="space-y-4">
                            <button onClick={() => handleEdit(selectedEmployee)} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                                Edit
                            </button>
                            <button onClick={() => handleDelete(selectedEmployee)} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                                Delete
                            </button>
                            <button onClick={() => setShowActionPopup(false)} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showPopup && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-4 rounded-lg shadow-lg">
                        <h2 className="text-xl font-semibold mb-4">Edit Employee</h2>
                        {errorMessage && (
                            <div className="text-red-500 mb-4">
                                {errorMessage}
                            </div>
                        )}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium">Employee name</label>
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
                                <label className="block text-sm font-medium">Phone number</label>
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
                                <label className="block text-sm font-medium">Email address</label>
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
                                <label className="block text-sm font-medium">Date of birthday</label>
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
                                <label className="block text-sm font-medium">Basic salary</label>
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
                                <label className="block text-sm font-medium">Service charge (%)</label>
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
                                <label className="block text-sm font-medium">Hire date</label>
                                <input
                                    type="date"
                                    name="hire_date"
                                    placeholder="Hire Date"
                                    value={formData.hire_date}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded"
                                />
                            </div>
                            <div className="flex justify-between">
                                <button onClick={handleUpdate} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                                    Update
                                </button>
                                <button onClick={() => setShowPopup(false)} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UpdateEmployees;