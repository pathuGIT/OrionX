import React from 'react'

const SuperAdminSideNav = ({ setDisplay }) => {

    return (
        <div className=' border inline-block'>
            <li><button onClick={() => setDisplay('addEmployees')}>Add Employees</button></li>
            <li>Link</li>
            <li>Link</li>
        </div>
    )
}

export default SuperAdminSideNav