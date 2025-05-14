import { useContext, React, useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/Authcontext';
import { Logout } from './Logout';
import { getCusName } from '../services/CustomerServise';

export const Header = () => {
  const { user } = useContext(AuthContext);
  const [dashboard, setDashboard] = useState();
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false); // State for user dropdown visibility
  const [customerName, setCustomerName] = useState('');
  const dropdownRef = useRef(null); // Ref for dropdown

  useEffect(() => {
    if (sessionStorage.getItem('role') === 'super_admin') {
      setDashboard('/superAdmin');
    } else if (sessionStorage.getItem('role') === 'sub_admin') {
      setDashboard('/subAdmin');
    } else if (sessionStorage.getItem('role') === 'employee') {
      setDashboard('/employee');
    } else if (sessionStorage.getItem('role') === 'customer') {
      setDashboard('/customer');
    } else {
      setDashboard(null);
    }
  }, [user]);

  // Fetch customer name
  useEffect(() => {

    if (sessionStorage.getItem('role') === 'customer') {
      fetchCustomerName();
    }
  }, [user]);

  const fetchCustomerName = async () => {
    console.log('Fetching customer name...: ', sessionStorage.getItem('id'));
    const name = await getCusName(sessionStorage.getItem('id'));
    console.log('Fetching customer name...: ', name);
    setCustomerName(name);
  };

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen((prev) => !prev); // Toggle dropdown visibility
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsUserDropdownOpen(false); // Close dropdown if clicked outside
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside); // Add event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside); // Cleanup event listener
    };
  }, []);

  const firstCharacter = customerName.charAt(0); // Using charAt
  // or
  const firstCharacterAlt = customerName[0]; // Using array indexing

  return (
    // <header className="mx-20 mt-10 border border-black">
    <header className="bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <nav className="bg-white border-gray-200 dark:bg-gray-900 ">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4 ">
          <a href="#" className="flex items-center space-x-3 rtl:space-x-reverse">
            <img src="/15.svg" className="h-8" alt="Flowbite Logo" />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Deandra</span>
          </a>
          <div className="relative flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse ">
            {/* User Menu Button */}
            <Link to="/login" className={`${sessionStorage.getItem('role') == 'customer' || sessionStorage.getItem('role') != null ? 'hidden ' : 'visible absolute right-2'}`}>Login</Link>

            <button
              type="button"
              className="border flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
              id="user-menu-button"
              onClick={toggleUserDropdown} // Toggle dropdown on click
            > 
              <div className={`w-8 h-8 rounded-full bg-white flex justify-center items-center overflow-hidden ${sessionStorage.getItem('role') == 'customer' ? 'visible' : 'hidden'}`}>{firstCharacter}</div>
              {/* <img className={`w-8 h-8 rounded-full ${sessionStorage.getItem('role') == 'customer' ? 'visible' : 'hidden'}`} src="/docs/images/people/profile-picture-3.jpg" alt="user photo" /> */}
              <span className="sr-only">Open user menu</span>
            </button>

            {/* User Dropdown */}
            <div
              ref={dropdownRef} // Attach ref to dropdown
              className={`absolute right-0 mt-[200px] z-50 ${isUserDropdownOpen ? 'block' : 'hidden'} w-48 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow-sm dark:bg-gray-700 dark:divide-gray-600`}
              id="user-dropdown"
            >
              <div className="px-4 py-3">
                <span className="block text-sm text-gray-900 dark:text-white">{customerName || 'Loading...'}</span>
                <span className="block text-sm text-gray-500 truncate dark:text-gray-400">{sessionStorage.getItem('credential')}</span>
              </div>
              <ul className="py-2" aria-labelledby="user-menu-button">
                <li>
                  <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white" >Dashboard</Link>
                </li>
                <li>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">
                    <Logout />
                  </a>
                </li>
              </ul>
            </div>
            <button
              data-collapse-toggle="navbar-user"
              type="button"
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              aria-controls="navbar-user"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M1 1h15M1 7h15M1 13h15"
                />
              </svg>
            </button>
          </div>
          <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-user">
            <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              <li>
                {/* <a href="#" className="block py-2 px-3 text-white bg-blue-700 rounded-sm md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500" aria-current="page">Home</a> */}
                <Link to="/" className={`${dashboard == null || sessionStorage.getItem('role') == 'customer' ? 'visible' : 'hidden'} block py-2 px-3 text-white bg-blue-700 rounded-sm md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500`}>Home</Link>
                <Link to={dashboard} className={`${user != null && sessionStorage.getItem('role') != 'customer' ? 'visible' : 'hidden'}`} >Dashboard</Link>
              </li>
              <li>
                <a href="#" className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">About</a>
              </li>
              <li>
                <a href="#" className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Services</a>
              </li>
              <li>
                <a href="#" className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Pricing</a>
              </li>
              <li>
                <a href="#" className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Contact</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};
