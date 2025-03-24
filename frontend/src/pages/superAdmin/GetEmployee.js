import React, { useEffect ,useState} from 'react'
import { getEmployees } from '../../services/UserService';   

const  GetEmployees = () => {
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        CallGetEmployees();
    },[]);


const CallGetEmployees = async () => {
    const response = await getEmployees();
    setEmployees( response.employees);
}

  return (
    <div>
      <p>Get Employee</p>
      {employees.map((emp) => (
        <ul className='border p-2 my-2' key={emp.employee_id}>
            <li>{emp.employee_id}</li>
            <li>{emp.name}</li>
            <li>{emp.phone}</li>
            <li>{emp.email}</li>
            <li>{emp.bod}</li>
            <li>{emp.salary}</li>
            <li>{emp.hire_date}</li>
        </ul>
        
      ))}
    </div>
  )
}

export default GetEmployees
