import React, { useEffect } from 'react'
import { Logout } from '../../components/Logout'

const BookingManagementSAN = ({ setRenderContent }) => {
    useEffect(() => {
        handleRenderContent('null')
    }, [])
    
    const handleRenderContent = (display) => {
        switch (display) {
            // case 'test':
            //     setRenderContent(() => () => <AddEmployee />);
            //     break;
            default:
                setRenderContent(() => () => <p>Page not found</p>);
        }
    };
    return (
        <div className=''>
            <ul class="flex flex-col py-4 ">
                <li>
                    <button onClick={() => handleRenderContent('test')} class="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-white hover:text-gray-800">
                        <span class="inline-flex items-center justify-center h-12 w-12 text-lg text-white"><i class="bx bx-home"></i></span>
                        <span class="text-sm font-medium">Test Link</span>
                    </button>
                </li>
                <li>
                    <a href="#" class=" text-white hover:text-gray-800">
                        <span class="inline-flex items-center justify-center h-12 w-12 texttext-white"><i class="bx bx-log-out"></i></span>
                        <span class="text-sm font-medium"> <Logout /> </span>
                    </a>
                </li>
            </ul>
        </div>
    )
}

export default BookingManagementSAN