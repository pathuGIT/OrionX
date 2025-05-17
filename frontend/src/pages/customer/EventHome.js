import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import EventHomeSideNav from './EventHomeSideNav';
import EventPlan from './CustomerEventPlanning';
import DisplayEvents from '../../pages/customer/DisplayEvents';
import EventServicesSelector from './EventServicesSelector';
import ServiceVendor from './ServiceVendor';
import TableReservation from './TableReservation';
import ChairArrangement from './ChairArrangement';
import ArrangementDetailsPage from './ArrangementDetailsPage';
import PlanBarForm from './PlanBarForm';
import PlanBiteForm from './PlanBiteForm';

import CustomerMenuListSelection from '../../components/CustomerMenuListSelection';
import BarManagement from './BarManagement';

// import ProfileNavbar from '../components/ProfileNavbar';

const EventHome = () => {
  const { bookingId, customerID } = useParams();
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
        return <EventPlan bookingId={bookingId} />;
      case 'view-events':
        return <DisplayEvents customerID={customerID} />;
      case 'Select-Services':
        return <EventServicesSelector customerID={customerID} bookingId={bookingId} />;
      case 'view-Vendors':
        return <ServiceVendor customerID={customerID} bookingId={bookingId} />;
      case 'Select-Tables':
        return <ChairArrangement bookingId={bookingId} />;
      case 'Reserve-Tables':
        return <TableReservation bookingId={bookingId} />;
      case 'see-arrangements':
        return <ArrangementDetailsPage bookingId={bookingId} />;
      case 'Select-bar-Times':
        return <PlanBarForm bookingId={bookingId} />;
      case 'setect-bites':
        return <PlanBiteForm bookingId={bookingId} />;
      case 'select-bar-arrangements':
        return <BarManagement bookingId={bookingId} />;
      case 'plan-menulist':
        return <CustomerMenuListSelection/>;
      case 'dashboard':
      default:
        return (
          <div>
            <h1 className="text-2xl font-bold mb-6">Event Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <i className="fas fa-calendar-check text-blue-500 text-2xl mr-4"></i>
                  <div>
                    <p className="text-gray-500">Active Bookings</p>
                    <h3 className="text-xl font-bold ">2</h3>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <i className="fas fa-clock text-yellow-500 text-2xl mr-4"></i>
                  <div>
                    <p className="text-gray-500">Pending Events</p>
                    <h3 className="text-xl font-bold">1</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

return (
  <div className="min-h-screen bg-gray-100 flex">
    {/* Side Navigation */}
    <div className="fixed md:relative z-50">
      <EventHomeSideNav
        setActivePage={setActivePage}
        closeSidebar={closeSidebar}
        className={`transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      />
    </div>

    {/* Main Content */}
    <main className="flex-1 min-h-screen md:ml-15 transition-margin duration-300">
      {/* Content Container */}
      <div className="p-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          {renderContent()}
        </div>
      </div>
    </main>

    {/* Mobile Overlay */}
    {sidebarOpen && (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
        onClick={() => setSidebarOpen(false)}
      ></div>
    )}
  </div>
);
};

export default EventHome;