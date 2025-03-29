import React, { useState } from 'react'
import SuperAdminSideNav from '../components/SuperAdminSideNav';
import { useNavigate } from 'react-router-dom';
import SuperAdminHome from './superAdmin/SuperAdminHome';
import AddEmployee from './superAdmin/AddEmployee';
import GetEmployees from './superAdmin/GetEmployee';
import UpdateEmployees from './superAdmin/UpdateEmployees';
import CreateMenuListType from './superAdmin/CreateMenuListType';

const SuperAdminDB = () => {
  const navigate = useNavigate();
  const [display, setDisplay] = useState('superAdminHome');
  const renderContent = () => {
    switch (display) {    
      case 'superAdminHome':
        return <SuperAdminHome />
      case 'addEmployees':
        return <AddEmployee />
      case 'getEmployees':
        return <GetEmployees />
      case 'updateEmployeesById':
        return <UpdateEmployees/> 
      case 'createMenu':
        return <CreateMenuListType/>

      default:
        return <p>Page not found</p>;
    }
  };

  return (
    <div className='flex' style={{ minHeight: '85vh' }}>
      <div className='border py-1 px-1 bg-red-100 w-1/5'>
        <SuperAdminSideNav setDisplay={setDisplay} />
      </div>
      <div className='border py-2 px-2 bg-slate-400 w-full'>
        {renderContent()}
      </div>
    </div>
  );
}

export default SuperAdminDB