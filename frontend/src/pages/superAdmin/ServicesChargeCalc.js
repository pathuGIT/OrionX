import React, { useState, useEffect } from 'react';
import { getEmployees } from '../../services/UserService'; // Assuming this service fetches employee data

const ServicesChargeCalc = () => {
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [serviceCharge, setServiceCharge] = useState(0);

    useEffect(() => {
        // Fetch employees on component mount
        const fetchEmployees = async () => {
            try {
                const response = await getEmployees();
                setEmployees(response.employees);
            } catch (error) {
                console.error('Error fetching employees:', error);
            }
        };
        fetchEmployees();
    }, []);

    const handleEmployeeSelect = (e) => {
        const employeeId = e.target.value;
        const employee = employees.find(emp => emp.employee_id === employeeId);
        setSelectedEmployee(employee);

        // Calculate service charge
        if (employee) {
            const charge = (employee.salary * employee.service_charge_precentage) / 100;
            setServiceCharge(charge);
        }
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold text-center mb-6">Services Charge Calculation</h1>
            <div className="mb-6">
                <label htmlFor="employeeSelect" className="block text-lg font-medium mb-2">Select Employee:</label>
                <select 
                    id="employeeSelect" 
                    onChange={handleEmployeeSelect} 
                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">-- Select --</option>
                    {employees.map(emp => (
                        <option key={emp.employee_id} value={emp.employee_id}>
                            {emp.name}
                        </option>
                    ))}
                </select>
            </div>

            {selectedEmployee && (
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Employee Information</h2>
                    <p className="mb-2"><strong>Name:</strong> {selectedEmployee.name}</p>
                    <p className="mb-2"><strong>Salary:</strong> Rs {selectedEmployee.salary}</p>
                    <p className="mb-2"><strong>Service Charge Percentage:</strong> {selectedEmployee.service_charge_precentage}%</p>
                    <p className="mb-2"><strong>Calculated Service Charge:</strong> Rs {serviceCharge}</p>
                </div>
            )}
        </div>
    );
};

export default ServicesChargeCalc;