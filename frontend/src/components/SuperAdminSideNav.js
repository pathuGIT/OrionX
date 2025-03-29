import React from 'react'

const SuperAdminSideNav = ({ setDisplay }) => {

    return (
        <div className=' border inline-block'>
            <li><button onClick={() => setDisplay('addEmployees')}>Add Employees</button></li>
            <li><button onClick={() => setDisplay('getEmployees')}>GetEmployees</button></li>
            <li><button onClick={() => setDisplay('updateEmployeesById')}>updateEmployee</button></li>
            {/* <li><button onClick={() => setDisplay('getMenus')}>Get Menus</button> </li> */}
            <li><button onClick={() => setDisplay('createMenu')}>Create Menu</button></li>  
        </div>
    )
}

export default SuperAdminSideNav