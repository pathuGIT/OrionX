import React from 'react'
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { addCustomer } from '../../services/CustomerServise';

const AddCustomer = () => {
    const [user, setUser] = useState({ name: '', phone: '', email: '', address: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { message } = await addCustomer(user);
            console.log(message);
            alert(message); // Display success message
            setUser({ name: '', phone: '', email: '', address: '' }); // Clear input fields
        } catch (error) {
            console.error('Adding Error:', error); // Log the error
            if (error.response && error.response.data && error.response.data.message) {
                alert(error.response.data.message); // Display server error message
            } else {
                alert('An unexpected error occurred.'); // Fallback error message
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };

    return (
        <div class="sm:mx-auto sm:w-full sm:max-w-sm  mt-20">
            <h1 className=' text-xl mb-7'>New Customer</h1>

            <form onSubmit={handleSubmit} className='mt-2'>
                <div>
                    <label for="email" class="block text-sm/6 font-medium text-gray-900">Customer full name</label>
                    <div class="space-y-6 mt-2">
                        <input type="text"
                            name="name"
                            required
                            placeholder="e.g. Shahan Aththalage"
                            class="block w-full rounded-md bg-white px-3 py-1 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            value={user.name}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div>
                    <label for="email" class="block text-sm/6 font-medium text-gray-900">Phone number</label>
                    <div class="space-y-6 mt-2">
                        <input type="text"
                            name="phone"
                            required
                            placeholder="e.g. +94 xxxxxxxxx"
                            class="block w-full rounded-md bg-white px-3 py-1 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            value={user.phone}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div>
                    <label for="email" class="block text-sm/6 font-medium text-gray-900">Email address</label>
                    <div class="space-y-6 mt-2">
                        <input type="email"
                            name="email"
                            autocomplete="email"
                            required
                            placeholder="e.g. example@gmail.com"
                            class="block w-full rounded-md bg-white px-3 py-1 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            value={user.email}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div>
                    <label for="email" class="block text-sm/6 font-medium text-gray-900">Address</label>
                    <div class="space-y-6 mt-2">
                        <input type="text"
                            name="address"
                            required
                            placeholder="e.g. No:xx, Saddathissa Road, Galle"
                            class="block w-full rounded-md bg-white px-3 py-1 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            value={user.address}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className='mt-5'>
                    <button type="submit" class="text-white bg-[#24292F] hover:bg-[#24292F]/90 focus:ring-4 focus:outline-none focus:ring-[#24292F]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-500 dark:hover:bg-[#050708]/30 me-2 mb-2">
                        {/* <svg class="w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 .333A9.911 9.911 0 0 0 6.866 19.65c.5.092.678-.215.678-.477 0-.237-.01-1.017-.014-1.845-2.757.6-3.338-1.169-3.338-1.169a2.627 2.627 0 0 0-1.1-1.451c-.9-.615.07-.6.07-.6a2.084 2.084 0 0 1 1.518 1.021 2.11 2.11 0 0 0 2.884.823c.044-.503.268-.973.63-1.325-2.2-.25-4.516-1.1-4.516-4.9A3.832 3.832 0 0 1 4.7 7.068a3.56 3.56 0 0 1 .095-2.623s.832-.266 2.726 1.016a9.409 9.409 0 0 1 4.962 0c1.89-1.282 2.717-1.016 2.717-1.016.366.83.402 1.768.1 2.623a3.827 3.827 0 0 1 1.02 2.659c0 3.807-2.319 4.644-4.525 4.889a2.366 2.366 0 0 1 .673 1.834c0 1.326-.012 2.394-.012 2.72 0 .263.18.572.681.475A9.911 9.911 0 0 0 10 .333Z" clip-rule="evenodd" />
                    </svg> */}
                        Add Customer
                    </button>
                </div>
            </form>
        </div>
    )
}

export default AddCustomer