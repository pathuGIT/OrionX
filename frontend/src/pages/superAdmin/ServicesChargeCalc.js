import React, { useState, useEffect } from 'react';
import { getEmployees } from '../../services/UserService'; // Assuming this service fetches employee data

const ServicesChargeCalc = () => {
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [serviceCharge, setServiceCharge] = useState(0);
    const [tableData, setTableData] = useState([]);

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

            // Add data to the table
            const newRow = {
                services_charge_id: `SC-${employee.employee_id}`,
                Employee_ID: employee.employee_id,
                Name: employee.name,
                service_charge_precentage: employee.service_charge_precentage,
                Hire_Date: employee.hire_date || 'N/A', // Replace with actual data if available
                amount: charge,
                Booking_Date: new Date().toISOString().split('T')[0], // Current date
                Status: 'Pending', // Default status
            };
            setTableData(prevData => [...prevData, newRow]);
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
                <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                    <h2 className="text-xl font-semibold mb-4">Employee Information</h2>
                    <p className="mb-2"><strong>Name:</strong> {selectedEmployee.name}</p>
                    <p className="mb-2"><strong>Salary:</strong> Rs {selectedEmployee.salary}</p>
                    <p className="mb-2"><strong>Service Charge Percentage:</strong> {selectedEmployee.service_charge_precentage}%</p>
                    <p className="mb-2"><strong>Calculated Service Charge:</strong> Rs {serviceCharge}</p>
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 border-b">Services Charge ID</th>
                            <th className="px-4 py-2 border-b">Employee ID</th>
                            <th className="px-4 py-2 border-b">Name</th>
                            <th className="px-4 py-2 border-b">Service Charge %</th>
                            <th className="px-4 py-2 border-b">Hire Date</th>
                            <th className="px-4 py-2 border-b">Amount</th>
                            <th className="px-4 py-2 border-b">Booking Date</th>
                            <th className="px-4 py-2 border-b">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableData.map((row, index) => (
                            <tr key={index} className="text-center">
                                <td className="px-4 py-2 border-b">{row.services_charge_id}</td>
                                <td className="px-4 py-2 border-b">{row.Employee_ID}</td>
                                <td className="px-4 py-2 border-b">{row.Name}</td>
                                <td className="px-4 py-2 border-b">{row.service_charge_precentage}%</td>
                                <td className="px-4 py-2 border-b">{row.Hire_Date}</td>
                                <td className="px-4 py-2 border-b">Rs {row.amount}</td>
                                <td className="px-4 py-2 border-b">{row.Booking_Date}</td>
                                <td className="px-4 py-2 border-b">{row.Status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ServicesChargeCalc;