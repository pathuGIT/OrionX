import React, { useEffect, useState } from 'react';
import superAdminHome from '../../pages/superAdmin/SuperAdminHome';
import AddEmployee from '../../pages/superAdmin/AddEmployee';
//import GetEmployees from '../../pages/superAdmin/GetEmployee';
import UpdateEmployees from '../../pages/superAdmin/UpdateEmployees';
import { Logout } from '../../components/Logout'


// Set display according to user management butttons
const UserManagementSAN = ({ setRenderContent }) => {
  useEffect(() => {
    handleRenderContent('null')
  },[])
  const handleRenderContent = (display) => {
    switch (display) {
      case 'addEmployees':
        setRenderContent(() => () => <AddEmployee />);
        break;
      // case 'getEmployees':
      //   setRenderContent(() => () => <GetEmployees />);
      //   break;
      case 'updateEmployeesById':
        setRenderContent(() => () => <UpdateEmployees />);
        break;
      default:
        setRenderContent(() => () => <p>Page not found</p>);
    }
  };

  //Display buttons in left side nav for user management
  return (
    <div className=''>
      <ul class="flex flex-col py-4 ">
        <li>
          <button onClick={() => handleRenderContent('addEmployees')} class="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-white hover:text-gray-800">
            <span class="inline-flex items-center justify-center h-12 w-12 text-lg text-white"><i class="bx bx-home"></i></span>
            <span class="text-sm font-medium">Add Employees</span>
          </button>
        </li>
        {/* <li>
          <button onClick={() => handleRenderContent('getEmployees')} class="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-white hover:text-gray-800">
            <span class="inline-flex items-center justify-center h-12 w-12 text-lg text-white"><i class="bx bx-home"></i></span>
            <span class="text-sm font-medium">Get Employees</span>
          </button>
        </li> */}
        <li>
          <button onClick={() => handleRenderContent('updateEmployeesById')} class="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-white hover:text-gray-800">
            <span class="inline-flex items-center justify-center h-12 w-12 text-lg text-white"><i class="bx bx-home"></i></span>
            <span class="text-sm font-medium">Modify Employees</span>
          </button>
        </li>
        <li>
          <a href="#" class="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-white hover:text-gray-800">
            <span class="inline-flex items-center justify-center h-12 w-12 text-lg text-white"><i class="bx bx-bell"></i></span>
            <span class="text-sm font-medium">Notifications</span>
            <span class="ml-auto mr-6 text-sm bg-red-100 rounded-full px-3 py-px text-red-500">5</span>
          </a>
        </li>
        <li>
          <a href="#" class=" text-white hover:text-gray-800">
            <span class="inline-flex items-center justify-center h-12 w-12 texttext-white"><i class="bx bx-log-out"></i></span>
            <span class="text-sm font-medium"> <Logout /> </span>
          </a>
        </li>
      </ul>
    </div>
  )
}

export default UserManagementSAN