import React, { useEffect, useState } from 'react'
import { getEmploees } from '../../services/UserService';

const GetEmployees = () => {
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        callGetEmployees();
    }, [])

    const callGetEmployees = async () => {
        const response = await getEmploees();
        setEmployees(response.employees);
    }

    return (
        <div>
            <h2 className=' h-2'>GetEmployees</h2>
            {employees.map((emp) => (
                <ul className=' border px-2 py-2' key={emp.employee_id}>
                    <li>{emp.employee_id}</li>
                    <li>{emp.name}</li>
                    <li>{emp.email}</li>
                    <li>{emp.phone}</li>
                    <li>{emp.bod}</li>
                    <li>{emp.hire_date}</li>
                </ul>
            ))}
        </div>
    )
}

export default GetEmployees