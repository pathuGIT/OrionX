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
        <div>
            <h1>Services Charge Calculation</h1>
            <div>
                <label htmlFor="employeeSelect">Select Employee:</label>
                <select id="employeeSelect" onChange={handleEmployeeSelect}>
                    <option value="">-- Select --</option>
                    {employees.map(emp => (
                        <option key={emp.employee_id} value={emp.employee_id}>
                            {emp.name}
                        </option>
                    ))}
                </select>
            </div>

            {selectedEmployee && (
                <div>
                    <h2>Employee Information</h2>
                    <p><strong>Name:</strong> {selectedEmployee.name}</p>
                    <p><strong>Salary:</strong> Rs {selectedEmployee.salary}</p>
                    <p><strong>Service Charge Percentage:</strong> {selectedEmployee.service_charge_precentage}%</p>
                    <p><strong>Calculated Service Charge:</strong> Rs {serviceCharge}</p>
                </div>
            )}
        </div>
    );
};

export default ServicesChargeCalc;