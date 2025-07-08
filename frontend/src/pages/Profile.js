import React, { useState } from 'react';
import ProfileNavbar from '../components/ProfileNavbar';
import ProfileSideNav from '../components/ProfileSideNav';
import CustomerBookings from './customer/CustomerBooking';
import { FaCalendarCheck, FaTasks, FaRegClock } from 'react-icons/fa';

const Card = ({ title, value, icon, color }) => (
    <div className={`p-6 rounded-lg shadow-lg transform hover:-translate-y-2 transition-transform duration-300 ${color}`}>
        <div className="flex items-center">
            <div className="mr-4 text-white text-3xl">{icon}</div>
            <div>
                <p className="text-white font-semibold">{title}</p>
                <h3 className="text-2xl font-bold text-white">{value}</h3>
            </div>
        </div>
    </div>
);

const Profile = () => {
    const [activePage, setActivePage] = useState('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const renderContent = () => {
        switch (activePage) {
            case 'plan-event':
                return <CustomerBookings />;
            case 'dashboard':
            default:
                return (
                    <div>
                        <h1 className="text-3xl font-bold mb-8 text-gray-800">Dashboard Overview</h1>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            <Card title="Upcoming Events" value="2" icon={<FaCalendarCheck />} color="bg-gradient-to-r from-blue-500 to-blue-400" />
                            <Card title="Pending Tasks" value="5" icon={<FaTasks />} color="bg-gradient-to-r from-green-500 to-green-400" />
                            <Card title="Hours Logged" value="42" icon={<FaRegClock />} color="bg-gradient-to-r from-red-500 to-red-400" />
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <ProfileNavbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

            <div className="flex">
                <ProfileSideNav
                    activePage={activePage}
                    setActivePage={setActivePage}
                    isOpen={sidebarOpen}
                    setIsOpen={setSidebarOpen}
                />

                <main className="flex-1 p-4 sm:p-6 lg:p-8 transition-all duration-300">
                    <div className="bg-white shadow-md rounded-xl p-6">
                        {renderContent()}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Profile;