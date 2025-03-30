import React from 'react'

const SuperAdminSideNav = ({ setDisplay }) => {

    return (
        <div className=' border inline-block'>
            <li><button onClick={() => setDisplay('addEmployees')}>Add Employees</button></li>
            <li><button onClick={() => setDisplay('getEmployees')}>GetEmployees</button></li>
            <li><button onClick={() => setDisplay('updateEmployeesById')}>updateEmployee</button></li>
            {/* <li><button onClick={() => setDisplay('getMenus')}>Get Menus</button> </li> */}
            <li><button onClick={() => setDisplay('createMenu')}>Create Menu list type</button></li>  
            <li><button onClick={() => setDisplay('createMenuType')}>Create Menu Type</button></li>
            <li><button onClick={() => setDisplay('createCategories')}>Create Categories</button></li>
            <li><button onClick={() => setDisplay('createItem')}>Create Items</button></li>
        </div>
    )
}

export default SuperAdminSideNav