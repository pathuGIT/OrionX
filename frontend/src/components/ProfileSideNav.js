import React, { useState } from 'react';
import { Logout } from '../components/Logout';

const ProfileSideNav = ({ setActivePage, closeSidebar }) => {
  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  return (
    <aside className="w-64 bg-gray-800 h-full fixed left-0 top-0 md:relative md:translate-x-0 transform transition-transform duration-300 ease-in-out">
      <div className="flex items-center justify-between h-16 px-4 bg-gray-900">
        <span className="text-white text-lg font-bold">Profile</span>
      </div>
      <nav className="mt-5 overflow-y-auto h-[calc(100vh-4rem)]">
        <button
          onClick={() => {
            setActivePage('dashboard');
            closeSidebar();
          }}
          className="w-full flex items-center px-4 py-2 text-gray-100 hover:bg-gray-700"
        >
          <i className="fas fa-tachometer-alt mr-3"></i>Dashboard
        </button>

        <div className="border-t border-gray-700 my-2"></div>

        <div>
          <button 
            onClick={() => toggleMenu('events')}
            className="w-full flex items-center justify-between px-4 py-2 text-gray-100 hover:bg-gray-700"
          >
            <div className="flex items-center">
              <i className="fas fa-calendar mr-3"></i>Event Planning
            </div>
            <i className={`fas ${openMenu === 'events' ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
          </button>
          {openMenu === 'events' && (
            <div className="bg-gray-700">
              <button
                onClick={() => {
                  setActivePage('plan-event');
                  closeSidebar();
                }}
                className="block px-8 py-2 text-gray-200 hover:bg-gray-600 w-full text-left"
              >
                Plan Event
              </button>
              <button
                onClick={() => {
                  setActivePage('my-events');
                  closeSidebar();
                }}
                className="block px-8 py-2 text-gray-200 hover:bg-gray-600 w-full text-left"
              >
                My Events
              </button>
            </div>
          )}
        </div>

        <div className="border-t border-gray-700 my-2"></div>

        <div className="mt-auto">
          <div className="px-4 py-2 text-gray-100 hover:bg-gray-700 cursor-pointer">
            <Logout />
          </div>
        </div>
      </nav>
    </aside>
  );
};

export default ProfileSideNav;