import React, { useState, useEffect } from 'react';
// import ProfileNavbar from '../components/ProfileNavbar';
import ProfileSideNav from '../components/ProfileSideNav';
import CustomerBookings from './customer/CustomerBooking';

const Profile = () => {
  const [activePage, setActivePage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = () => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const renderContent = () => {
    switch (activePage) {
      case 'plan-event':
        return <CustomerBookings />;
      case 'dashboard':
      default:
        return (
          <div>
            <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <i className="fas fa-calendar-check text-blue-500 text-2xl mr-4"></i>
                  <div>
                    <p className="text-gray-500">Upcoming Events</p>
                    <h3 className="text-xl font-bold">2</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* <ProfileNavbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} /> */}

      <div className="flex">
        {/* Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        <ProfileSideNav
          setActivePage={setActivePage}
          closeSidebar={closeSidebar}
          className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } md:translate-x-0`}
        />

        <main className={`flex-1 p-6 overflow-y-auto transition-all duration-300 ${sidebarOpen ? 'md:ml-3' : 'ml-0'}`}>
          <div className="bg-white shadow-md rounded-lg p-6">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;