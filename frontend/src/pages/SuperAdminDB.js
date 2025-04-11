import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SuperAdminHome from './superAdmin/SuperAdminHome';
import UserManagementSAN from '../components/superAdminSideNavs/UserManagementSAN';
import EventManagementSAN from '../components/superAdminSideNavs/EventManagementSAN';
import MenuManagementSAN from '../components/superAdminSideNavs/MenuManagementSAN';
import DefaultSAN from '../components/superAdminSideNavs/DefaultSAN';
import PayrollManagementSAN from '../components/superAdminSideNavs/PayrollManagementSAN';
import BookingManagementSAN from '../components/superAdminSideNavs/BookingManagementSAN';
import CustomersManagementSAN from '../components/superAdminSideNavs/CustomersManagementSAN';

const SuperAdminDB = () => {
  const [topNav, setTopNav] = useState();
  const [renderContent, setRenderContent] = useState(() => () => <SuperAdminHome />);

  // Render the left side navigation bars
  const renderNavs = () => {
    switch (topNav) {
      case 'A':
        return <UserManagementSAN setRenderContent={setRenderContent} />;
      case 'C':
        return <EventManagementSAN setRenderContent={setRenderContent} />;
      case 'D':
        return <MenuManagementSAN setRenderContent={setRenderContent} />;
      case 'B':
        return <PayrollManagementSAN setRenderContent={setRenderContent} />;
      case 'E':
        return <BookingManagementSAN setRenderContent={setRenderContent} />;
      case 'F':
        return <CustomersManagementSAN setRenderContent={setRenderContent} />;
      default:
        return <DefaultSAN setRenderContent={setRenderContent} />;
    }
  };

  // Top navigation bars
  return (
    <div className="flex bg-slate-100" style={{ minHeight: '85vh' }}>
      {/* overflow-y-auto py-5 px-3 h-full bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700 */}
      <div className="flex flex-col rounded-r-3xl overflow-hidden w-1/5 border-l border-gray-200 " style={{ backgroundColor: 'white' }}>
        {renderNavs()}
      </div>
      <div className="border py-2 px-2 bg-slate-100 w-full">
        <div className="hidden md:flex justify-between items-center w-full md:w-auto md:order-1 border px-2 py-1 bg-white">
          <ul className="flex-col md:flex-row flex md:space-x-8 mt-4 md:mt-0 md:text-sm md:font-medium">
            <li>
              <button type="button" onClick={() => setTopNav('A')} className="text-gray-700 text-base hover:bg-gray-50 border-b border-gray-100 md:hover:bg-transparent md:border-0 block pl-3 pr-4 py-2 md:hover:text-blue-700 md:p-0">
                Employees
              </button>
            </li>
            <li>
              <button type="button" onClick={() => setTopNav('B')} className="text-gray-700 text-base hover:bg-gray-50 border-b border-gray-100 md:hover:bg-transparent md:border-0 block pl-3 pr-4 py-2 md:hover:text-blue-700 md:p-0">
                Payroll
              </button>
            </li>
            <li>
              <button type="button" onClick={() => setTopNav('C')} className="text-gray-700 text-base hover:bg-gray-50 border-b border-gray-100 md:hover:bg-transparent md:border-0 block pl-3 pr-4 py-2 md:hover:text-blue-700 md:p-0">
                Events
              </button>
            </li>
            <li>
              <button type="button"onClick={() => setTopNav('D')}className="text-gray-700 text-base hover:bg-gray-50 border-b border-gray-100 md:hover:bg-transparent md:border-0 block pl-3 pr-4 py-2 md:hover:text-blue-700 md:p-0">
                Menus
              </button>
            </li>
            <li>
              <button type="button"onClick={() => setTopNav('E')}className="text-gray-700 text-base hover:bg-gray-50 border-b border-gray-100 md:hover:bg-transparent md:border-0 block pl-3 pr-4 py-2 md:hover:text-blue-700 md:p-0">
                Bookings
              </button>
            </li>
            <li>
              <button type="button"onClick={() => setTopNav('F')}className="text-gray-700 text-base hover:bg-gray-50 border-b border-gray-100 md:hover:bg-transparent md:border-0 block pl-3 pr-4 py-2 md:hover:text-blue-700 md:p-0">
                Customers
              </button>
            </li>
          </ul>
        </div>
        {renderContent()}
      </div>
    </div>
  );
};

export default SuperAdminDB;