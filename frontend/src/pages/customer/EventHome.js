import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaCalendarCheck, FaClock, FaTasks } from 'react-icons/fa';

// Import your components
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
import EventNavbar from './EventNavbar'; // New component

// A new, reusable card component for the dashboard
const DashboardCard = ({ title, value, icon, color }) => (
    <div className={`p-6 rounded-2xl shadow-lg transform hover:-translate-y-2 transition-transform duration-300 ${color}`}>
        <div className="flex items-center">
            <div className="mr-4 text-white text-3xl">{icon}</div>
            <div>
                <p className="text-lg font-semibold text-white">{title}</p>
                <h3 className="text-3xl font-bold text-white">{value}</h3>
            </div>
        </div>
    </div>
);

const EventHome = () => {
    const { bookingId, customerID } = useParams();
    const [activePage, setActivePage] = useState('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const renderContent = () => {
        switch (activePage) {
            case 'plan-event': return <EventPlan bookingId={bookingId} />;
            case 'view-events': return <DisplayEvents customerID={customerID} />;
            case 'Select-Services': return <EventServicesSelector customerID={customerID} bookingId={bookingId} />;
            case 'view-Vendors': return <ServiceVendor customerID={customerID} bookingId={bookingId} />;
            case 'Select-Tables': return <ChairArrangement bookingId={bookingId} />;
            case 'Reserve-Tables': return <TableReservation bookingId={bookingId} />;
            case 'see-arrangements': return <ArrangementDetailsPage bookingId={bookingId} />;
            case 'Select-bar-Times': return <PlanBarForm bookingId={bookingId} />;
            case 'setect-bites': return <PlanBiteForm bookingId={bookingId} />;
            case 'select-bar-arrangements': return <BarManagement bookingId={bookingId} />;
            case 'plan-menulist': return <CustomerMenuListSelection />;
            case 'dashboard':
            default:
                return (
                    <div>
                        <h1 className="text-4xl font-extrabold text-gray-800 mb-8">Event Dashboard</h1>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            <DashboardCard title="Active Bookings" value="2" icon={<FaCalendarCheck />} color="bg-gradient-to-r from-blue-500 to-indigo-500" />
                            <DashboardCard title="Pending Events" value="1" icon={<FaClock />} color="bg-gradient-to-r from-yellow-500 to-orange-500" />
                            <DashboardCard title="Tasks Due" value="4" icon={<FaTasks />} color="bg-gradient-to-r from-green-500 to-teal-500" />
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Top Navbar for Mobile */}
            <EventNavbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

            <div className="flex">
                {/* Sidebar */}
                <EventHomeSideNav
                    setActivePage={setActivePage}
                    isOpen={sidebarOpen}
                    setIsOpen={setSidebarOpen}
                />

                {/* Main Content */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8 transition-all duration-300">
                    <div className="bg-white shadow-xl rounded-2xl p-6">
                        {renderContent()}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default EventHome;