import React, { useState, useEffect } from 'react';
import { Logout } from '../../components/Logout';

const EventHomeSideNav = ({ setActivePage, closeSidebar }) => {
  const [openMenu, setOpenMenu] = useState(null);
  const [isHoverSupported, setIsHoverSupported] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(hover: hover)');
    const updateHoverSupport = (e) => {
      setIsHoverSupported(e.matches);
    };
    setIsHoverSupported(mediaQuery.matches);
    mediaQuery.addEventListener('change', updateHoverSupport);
    return () => {
      mediaQuery.removeEventListener('change', updateHoverSupport);
    };
  }, []);

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  return (
    <aside className="w-64 bg-gray-800 h-full fixed left-0 top-0 md:relative md:translate-x-0 transform transition-transform duration-300 ease-in-out">
      <div className="flex items-center justify-between h-16 px-4 bg-gray-900">
        <span className="text-white text-lg font-bold">Event Management</span>
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

        <div
          className="relative"
          onMouseEnter={isHoverSupported ? () => setOpenMenu('events') : undefined}
          onMouseLeave={isHoverSupported ? () => setOpenMenu(null) : undefined}
        >
          <button 
            onClick={!isHoverSupported ? () => toggleMenu('events') : undefined}
            className="w-full flex items-center justify-between px-4 py-2 text-gray-100 hover:bg-gray-700"
          >
            <div className="flex items-center">
              <i className="fas fa-calendar mr-3"></i>Plan Events
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
                Plan New Event
              </button>
              <button
                onClick={() => {
                  setActivePage('view-events');
                  closeSidebar();
                }}
                className="block px-8 py-2 text-gray-200 hover:bg-gray-600 w-full text-left"
              >
                View Planned Events
              </button>
            </div>
          )}
        </div>
        <div className="border-t border-gray-700 my-2"></div>
        <div
          className="relative"
          onMouseEnter={isHoverSupported ? () => setOpenMenu('EventServices') : undefined}
          onMouseLeave={isHoverSupported ? () => setOpenMenu(null) : undefined}
        >
          <button 
            onClick={!isHoverSupported ? () => toggleMenu('EventServices') : undefined}
            className="w-full flex items-center justify-between px-4 py-2 text-gray-100 hover:bg-gray-700"
          >
            <div className="flex items-center">
              <i className="fas fa-calendar mr-3"></i>Event Services
            </div>
            <i className={`fas ${openMenu === 'EventServices' ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
          </button>
          {openMenu === 'EventServices' && (
            <div className="bg-gray-700">
              <button
                onClick={() => {
                  setActivePage('Select-Services');
                  closeSidebar();
                }}
                className="block px-8 py-2 text-gray-200 hover:bg-gray-600 w-full text-left"
              >
                Select Event Services
              </button>
              <button
                onClick={() => {
                  setActivePage('view-Vendors');
                  closeSidebar();
                }}
                className="block px-8 py-2 text-gray-200 hover:bg-gray-600 w-full text-left"
              >
                See Vendors 
              </button>
            </div>
          )}
        </div>

        <div className="border-t border-gray-700 my-2"></div>

        <div
          className="relative"
          onMouseEnter={isHoverSupported ? () => setOpenMenu('TableManage') : undefined}
          onMouseLeave={isHoverSupported ? () => setOpenMenu(null) : undefined}
        >
          <button 
            onClick={!isHoverSupported ? () => toggleMenu('TableManage') : undefined}
            className="w-full flex items-center justify-between px-4 py-2 text-gray-100 hover:bg-gray-700"
          >
            <div className="flex items-center">
              <i className="fas fa-calendar mr-3"></i>Arrange Tables
            </div>
            <i className={`fas ${openMenu === 'TableManage' ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
          </button>
          {openMenu === 'TableManage' && (
            <div className="bg-gray-700">
              <button
                onClick={() => {
                  setActivePage('Select-Tables');
                  closeSidebar();
                }}
                className="block px-8 py-2 text-gray-200 hover:bg-gray-600 w-full text-left"
              >
                Select Designs
              </button>
              <button
                onClick={() => {
                  setActivePage('Reserve-Tables');
                  closeSidebar();
                }}
                className="block px-8 py-2 text-gray-200 hover:bg-gray-600 w-full text-left"
              >
                Book Tables 
              </button>
                            <button
                onClick={() => {
                  setActivePage('see-arrangements');
                  closeSidebar();
                }}
                className="block px-8 py-2 text-gray-200 hover:bg-gray-600 w-full text-left"
              >
                See Arrangements
              </button>
            </div>
          )}
        </div>

        <div className="mt-auto">
          <div className="px-4 py-2 text-gray-100 hover:bg-gray-700 cursor-pointer">
            <Logout />
          </div>
        </div>
      </nav>
    </aside>
  );
};

export default EventHomeSideNav;