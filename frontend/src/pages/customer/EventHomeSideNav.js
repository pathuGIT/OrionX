import React, { useState } from 'react';
import { Logout } from '../../components/Logout';
import {
    FaChartPie, FaCalendarPlus, FaUtensils, FaConciergeBell,
    FaChair, FaCocktail, FaChevronDown, FaChevronUp, FaTimes
} from 'react-icons/fa';

const NavItem = ({ icon, children, subItems, activePage, setActivePage, closeSidebar }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between px-4 py-3 text-gray-200 hover:bg-gray-700 rounded-lg transition-all duration-200"
            >
                <div className="flex items-center">
                    <div className="mr-4 text-lg">{icon}</div>
                    <span className="font-medium">{children}</span>
                </div>
                {subItems && (isOpen ? <FaChevronUp /> : <FaChevronDown />)}
            </button>
            {isOpen && subItems && (
                <div className="ml-6 mt-2 space-y-1 border-l-2 border-gray-600 pl-4">
                    {subItems.map((item, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                setActivePage(item.page);
                                closeSidebar();
                            }}
                            className="block w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-600 rounded-md transition-colors duration-150"
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

const EventHomeSideNav = ({ setActivePage, isOpen, setIsOpen }) => {
    const closeSidebar = () => {
        if (window.innerWidth < 768) {
            setIsOpen(false);
        }
    };

    const navItems = [
        { page: 'plan-event', label: '✨ Plan New Event' },
        { page: 'view-events', label: '📅 View Events' }
    ];
    const menuItems = [
        { page: 'plan-menulist', label: '🍽️ Select New Menu' },
        { page: 'my-menu', label: '📋 Saved Menus' }
    ];
    const servicesItems = [
        { page: 'Select-Services', label: '🛍️ Select Services' },
        { page: 'view-Vendors', label: '👥 See Vendors' }
    ];
    const tableItems = [
        { page: 'Select-Tables', label: '🎨 Select Designs' },
        { page: 'Reserve-Tables', label: '💺 Book Tables' },
        { page: 'see-arrangements', label: '👀 See Arrangements' }
    ];
    const barItems = [
        { page: 'Select-bar-Times', label: '⏰ Bar Times' },
        { page: 'setect-bites', label: '🍹 Bites ' },
        { page: 'select-bar-arrangements', label: '📋 Plan Bar' }
    ];

    return (
        <>
            <div
                className={`fixed inset-0 bg-black bg-opacity-60 z-30 md:hidden ${isOpen ? 'block' : 'hidden'}`}
                onClick={() => setIsOpen(false)}
            ></div>
            <aside
                className={`bg-gray-800 text-white w-64 min-h-screen fixed top-0 left-0 z-40 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out shadow-lg`}
            >
                <div className="flex items-center justify-between p-4 bg-gray-900">
                    <span className="text-xl font-bold">Event Menu</span>
                    <button onClick={() => setIsOpen(false)} className="md:hidden text-gray-300 hover:text-white">
                        <FaTimes size={24} />
                    </button>
                </div>

                <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-4rem)]">
                    <button
                        onClick={() => {
                            setActivePage('dashboard');
                            closeSidebar();
                        }}
                        className="w-full flex items-center px-4 py-3 text-gray-200 hover:bg-gray-700 rounded-lg transition-all duration-200"
                    >
                        <FaChartPie className="mr-4 text-lg text-purple-400" />
                        <span className="font-medium">Dashboard</span>
                    </button>
                    <div className="border-t border-gray-700 my-2"></div>
                    <NavItem icon={<FaCalendarPlus className="text-blue-400" />} subItems={navItems} setActivePage={setActivePage} closeSidebar={closeSidebar}>Plan Events</NavItem>
                    <NavItem icon={<FaUtensils className="text-orange-400" />} subItems={menuItems} setActivePage={setActivePage} closeSidebar={closeSidebar}>Menu Planning</NavItem>
                    <NavItem icon={<FaConciergeBell className="text-green-400" />} subItems={servicesItems} setActivePage={setActivePage} closeSidebar={closeSidebar}>Event Services</NavItem>
                    <NavItem icon={<FaChair className="text-yellow-400" />} subItems={tableItems} setActivePage={setActivePage} closeSidebar={closeSidebar}>Arrange Tables</NavItem>
                    <NavItem icon={<FaCocktail className="text-pink-400" />} subItems={barItems} setActivePage={setActivePage} closeSidebar={closeSidebar}>Bar Arrangements</NavItem>
                    <div className="border-t border-gray-700 my-2"></div>
                    <div className="px-4 py-3 text-gray-300 hover:bg-red-800/50 rounded-lg cursor-pointer">
                        <Logout />
                    </div>
                </nav>
            </aside>
        </>
    );
};

export default EventHomeSideNav;