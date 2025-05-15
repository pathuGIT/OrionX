import React, { useState, useEffect } from 'react';
import { Logout } from '../../components/Logout';

const EventHomeSideNav = ({ setActivePage, closeSidebar }) => {
  const [openMenu, setOpenMenu] = useState(null);
  const [isHoverSupported, setIsHoverSupported] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(hover: hover)');
    const updateHoverSupport = (e) => setIsHoverSupported(e.matches);
    setIsHoverSupported(mediaQuery.matches);
    mediaQuery.addEventListener('change', updateHoverSupport);
    return () => mediaQuery.removeEventListener('change', updateHoverSupport);
  }, []);

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  const NavItem = ({ children, icon, menuName, pageName, subItems }) => (
    <div
      className="relative group"
      onMouseEnter={isHoverSupported ? () => setOpenMenu(menuName) : undefined}
      onMouseLeave={isHoverSupported ? () => setOpenMenu(null) : undefined}
    >
      <button 
        onClick={!isHoverSupported ? () => toggleMenu(menuName) : undefined}
        className="w-full flex items-center justify-between px-4 py-3 text-gray-100 hover:bg-gray-700 rounded-lg transition-all duration-200 hover:translate-x-2"
      >
        <div className="flex items-center">
          <i className={`${icon} mr-3 text-lg`}></i>
          <span className="font-medium">{children}</span>
        </div>
        {subItems && (
          <i className={`fas ${openMenu === menuName ? 'fa-chevron-up' : 'fa-chevron-down'} text-sm text-gray-400`}></i>
        )}
      </button>
      
      {subItems && openMenu === menuName && (
        <div className="ml-4 mt-1 space-y-1 bg-gray-700/50 rounded-lg p-2 animate-slideIn">
          {subItems.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                setActivePage(item.page);
                closeSidebar();
              }}
              className="block px-4 py-2.5 text-gray-200 hover:bg-gray-600 w-full text-left rounded-md transition-colors duration-150"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <aside className="w-64 bg-gradient-to-b from-gray-800 to-gray-900 h-full fixed left-0 top-0 md:relative md:translate-x-0 transform transition-transform duration-300 ease-in-out shadow-xl">
      <div className="flex items-center justify-between h-20 px-6 bg-gradient-to-r from-indigo-600 to-purple-600">
        <span className="text-white text-xl font-bold tracking-wide">Event Management</span>
      </div>
      
      <nav className="mt-5 overflow-y-auto h-[calc(100vh-5rem)] px-4 space-y-1">
        <button
          onClick={() => {
            setActivePage('dashboard');
            closeSidebar();
          }}
          className="w-full flex items-center px-4 py-3 text-gray-100 hover:bg-gray-700 rounded-lg transition-all duration-200 group hover:translate-x-2"
        >
          <i className="fas fa-chart-pie mr-3 text-purple-400 group-hover:text-purple-300 text-lg"></i>
          <span className="font-medium">Dashboard</span>
        </button>

        <div className="border-t border-gray-700 my-3 opacity-50"></div>

        <NavItem
          icon="fas fa-calendar-plus text-blue-400 group-hover:text-blue-300"
          menuName="events"
          subItems={[
            { page: 'plan-event', label: '✨ Plan New Event' },
            { page: 'view-events', label: '📅 View Events' }
          ]}
        >
          Plan Events
        </NavItem>

        <NavItem
          icon="fas fa-utensils text-orange-400 group-hover:text-orange-300"
          menuName="menu"
          subItems={[
            { page: 'plan-menulist', label: '🍽️ Select New Menu' },
            { page: 'my-menu', label: '📋 Saved Menus' }
          ]}
        >
          Menu Planning
        </NavItem>

        <NavItem
          icon="fas fa-concierge-bell text-green-400 group-hover:text-green-300"
          menuName="EventServices"
          subItems={[
            { page: 'Select-Services', label: '🛍️ Select Services' },
            { page: 'view-Vendors', label: '👥 See Vendors' }
          ]}
        >
          Event Services
        </NavItem>

        <NavItem
          icon="fas fa-chair text-yellow-400 group-hover:text-yellow-300"
          menuName="TableManage"
          subItems={[
            { page: 'Select-Tables', label: '🎨 Select Designs' },
            { page: 'Reserve-Tables', label: '💺 Book Tables' },
            { page: 'see-arrangements', label: '👀 See Arrangements' }
          ]}
        >
          Arrange Tables
        </NavItem>

        <NavItem
          icon="fas fa-cocktail text-pink-400 group-hover:text-pink-300"
          menuName="BarPlan"
          subItems={[
            { page: 'Select-bar-Times', label: '⏰ Bar Times' },
            { page: 'setect-bites', label: '🍹 Bites & Drinks' },
            { page: 'see-bar-arrangements', label: '📋 Bar Arrangements' }
          ]}
        >
          Plan Bar
        </NavItem>

        <div className="border-t border-gray-700 my-3 opacity-50"></div>

        <div className="mt-8">
          <div className="px-4 py-3 text-gray-100 hover:bg-red-600/20 rounded-lg transition-colors duration-200 cursor-pointer group">
            <div className="flex items-center">
              <i className="fas fa-sign-out-alt mr-3 text-red-400 group-hover:text-red-300"></i>
              <Logout className="font-medium" />
            </div>
          </div>
        </div>
      </nav>
    </aside>
  );
};

export default EventHomeSideNav;