import React, { useEffect, useState } from 'react'
import { Logout } from '../../components/Logout'
import ServicesChargeCalc from '../../pages/superAdmin/ServicesChargeCalc'
import Deductions from '../../pages/superAdmin/Deductions';


const PayrollManagementSAN = ({ setRenderContent }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

    useEffect(() => {
        handleRenderContent('null')
    }, [])
    const handleRenderContent = (display) => {
        switch (display) {
            // case 'test':
            //     setRenderContent(() => () => <AddEmployee />);
            //     break;
            case 'ServicesChargeCalculation':
                setRenderContent(() => () => <ServicesChargeCalc/>);
                break;

            default:
                setRenderContent(() => () => <p>Page </p>);
        }
    };


    const handleRenderContentdeduction = (display) => {
        switch (display) {
            // case 'test':
            //     setRenderContent(() => () => <AddEmployee />);
            //     break;
            case 'deductionManagement':
                setRenderContent(() => () => <Deductions/>);
                break;

            default:
                setRenderContent(() => () => <p>Page </p>);
        }
    };


    return (
        // <div className=''>
        //     <ul class="flex flex-col py-4 ">
        //         <li>
        //             <button onClick={() => handleRenderContent('test')} class="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-white hover:text-gray-800">
        //                 <span class="inline-flex items-center justify-center h-12 w-12 text-lg text-white"><i class="bx bx-home"></i></span>
        //                 <span class="text-sm font-medium">Test Link</span>
        //             </button>
        //         </li>
        //         <li>
        //             <a href="#" class=" text-white hover:text-gray-800">
        //                 <span class="inline-flex items-center justify-center h-12 w-12 texttext-white"><i class="bx bx-log-out"></i></span>
        //                 <span class="text-sm font-medium"> <Logout /> </span>
        //             </a>
        //         </li>
        //     </ul>
        // </div>
        <div className=''>
            <ul class="flex flex-col py-4 ">
                <button type="button" class="fixed top-4 left-4 z-50 p-2 text-gray-500 bg-white rounded-lg shadow-md dark:bg-gray-800 dark:text-gray-400 sm:hidden" onClick={toggleSidebar}>
                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M3 5h14a1 1 0 010 2H3a1 1 0 110-2zm0 4h14a1 1 0 010 2H3a1 1 0 110-2zm0 4h14a1 1 0 010 2H3a1 1 0 110-2z" clipRule="evenodd"></path>
                    </svg>
                </button>
                <ul class="space-y-2">
                    <li>
                        <a href="#" onClick={() => handleRenderContent('ServicesChargeCalculation')} class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                            <svg aria-hidden="true" class="w-6 h-6 text-gray-400 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                                <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
                            </svg>
                            <span class="ml-3">ServicesCharge</span>
                        </a>
                    </li>

                    <li>
                        <a href="#" onClick={() => handleRenderContentdeduction('deductionManagement')} class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                            <svg aria-hidden="true" class="w-6 h-6 text-gray-400 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                                <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
                            </svg>
                            <span class="ml-3">Deduction</span>
                        </a>
                    </li>

                    <li>
                        <a href="#" class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
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

export default PayrollManagementSAN