import React, { useEffect, useState } from 'react'
import { Logout } from '../../components/Logout'
import AddCustomer from '../../pages/superAdmin/AddCustomer'
import ManageCustomer from '../../pages/superAdmin/ManageCustomer';
import Help from '../help/Help';
import CusHelpData from '../help/customerHelpData.json'

const CustomersManagementSAN = ({ setRenderContent }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [clickedItem, setClickedItem] = useState(null);
    const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

    useEffect(() => {
        handleRenderContent('null')
    }, [])

    const handleRenderContent = (display) => {
        switch (display) {
            case 'add-customer':
                setClickedItem('add-customer');
                setRenderContent(() => () => <AddCustomer />);
                break;
            case 'manage-customer':
                setClickedItem('manage-customer');
                setRenderContent(() => () => <ManageCustomer />);
                break;
            case 'help':
                setClickedItem('help');
                setRenderContent(() => () => <Help tz={CusHelpData} />);
                break;
            default:
                setClickedItem('manage-customer');
                setRenderContent(() => () => <ManageCustomer />);
        }
    };
    return (
        <div className=''>
            <ul class="flex flex-col py-4 ">
                <button type="button" class="fixed top-4 left-4 z-50 p-2 text-gray-500 bg-white rounded-lg shadow-md dark:bg-gray-800 dark:text-gray-400 sm:hidden" onClick={toggleSidebar}>
                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M3 5h14a1 1 0 010 2H3a1 1 0 110-2zm0 4h14a1 1 0 010 2H3a1 1 0 110-2zm0 4h14a1 1 0 010 2H3a1 1 0 110-2z" clipRule="evenodd"></path>
                    </svg>
                </button>
                <ul class="space-y-2">
                    <li>
                        <a href="#" onClick={() => handleRenderContent('add-customer')} class={`flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${clickedItem === 'add-customer' ? 'bg-gray-100 dark:bg-gray-700' : ''}`}>
                            <svg class="w-6 h-6 text-gray-400 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                <path fill-rule="evenodd" d="M9 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4H7Zm8-1a1 1 0 0 1 1-1h1v-1a1 1 0 1 1 2 0v1h1a1 1 0 1 1 0 2h-1v1a1 1 0 1 1-2 0v-1h-1a1 1 0 0 1-1-1Z" clip-rule="evenodd" />
                            </svg>
                            <span class="ml-3">Add Customer</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" onClick={() => handleRenderContent('manage-customer')} class={`flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${clickedItem === 'manage-customer' ? 'bg-gray-100 dark:bg-gray-700' : ''}`}>
                            <svg class="w-6 h-6 text-gray-400 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" stroke-linecap="square" stroke-linejoin="round" stroke-width="2" d="M10 19H5a1 1 0 0 1-1-1v-1a3 3 0 0 1 3-3h2m10 1a3 3 0 0 1-3 3m3-3a3 3 0 0 0-3-3m3 3h1m-4 3a3 3 0 0 1-3-3m3 3v1m-3-4a3 3 0 0 1 3-3m-3 3h-1m4-3v-1m-2.121 1.879-.707-.707m5.656 5.656-.707-.707m-4.242 0-.707.707m5.656-5.656-.707.707M12 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                            <span class="ml-3">Manage Customer</span>
                        </a>
                    </li>

                    <li>
                        <a href="#" onClick={() => handleRenderContent('help')} class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                            <svg aria-hidden="true" class="flex-shrink-0 w-6 h-6 text-gray-400 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M10 2a8 8 0 108 8 8 8 0 00-8-8zm1 12H9v-2h2zm0-4H9V6h2z" clipRule="evenodd"></path>
                            </svg>
                            <span class="ml-3">Help</span>
                        </a>
                    </li>
                    <li>
                        <button
                            onclick="handleLogout()"
                            class="flex items-center p-2 text-base font-normal text-red-600 rounded-lg hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-800 group w-full">
                            <svg
                                class="flex-shrink-0 w-6 h-6 text-red-500 transition duration-75 dark:text-red-400 group-hover:text-red-700 dark:group-hover:text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd"
                                    d="M3 4a1 1 0 011-1h6a1 1 0 110 2H5v10h5a1 1 0 110 2H4a1 1 0 01-1-1V4zm13.707 5.293a1 1 0 00-1.414-1.414L13 10.172l-1.293-1.293a1 1 0 10-1.414 1.414L11.586 12l-1.293 1.293a1 1 0 101.414 1.414L13 13.828l1.293 1.293a1 1 0 001.414-1.414L14.414 12l1.293-1.293z"
                                    clip-rule="evenodd"></path>
                            </svg>
                            <span class="ml-3"><Logout /></span>
                        </button>
                    </li>
                </ul>
            </ul>
        </div>
    )
}

export default CustomersManagementSAN