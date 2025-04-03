import React from 'react'
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { addEmployees } from '../../services/UserService';

const AddEmployee = () => {
  const [user, setUser] = useState({ name: '', phone: '', email: '', bod: '', serviceCharge: '', salary: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { message } = await addEmployees(user);
      console.log(message);
      alert(message); // Display success message
      setUser({ name: '', phone: '', email: '', bod: '', serviceCharge: '', salary: '' }); // Clear input fields
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
    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm  mt-5">
      <h1 className=' text-xl mb-7'>Add New Employee to the System</h1>

      <form onSubmit={handleSubmit} className='mt-2'>
        <div>
          <label for="email" class="block text-sm/6 font-medium text-gray-900">Employee name</label>
          <div class="space-y-6 mt-2">
            <input type="text"
              name="name"
              required
              placeholder="name"
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
              placeholder="+94 xxxxxxxxx"
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
              placeholder="example@gmail.com"
              class="block w-full rounded-md bg-white px-3 py-1 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              value={user.email}
              onChange={handleChange}
            />
          </div>
        </div>
        <div>
          <label for="email" class="block text-sm/6 font-medium text-gray-900">Birth Date</label>
          <div class="space-y-6 mt-2">
            <input type="date"
              name="bod"
              required
              class="block w-full rounded-md bg-white px-3 py-1 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              value={user.bod}
              onChange={handleChange}
            />
          </div>
        </div>
        <div>
          <label for="email" class="block text-sm/6 font-medium text-gray-900">Servise Charge</label>
          <div class="space-y-6 mt-2">
            <input type="text"
              name="serviceCharge"
              placeholder="Eg: 5%"
              class="block w-full rounded-md bg-white px-3 py-1 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              value={user.serviceCharge}
              onChange={handleChange}
            />
          </div>
        </div>
        <div>
          <label for="email" class="block text-sm/6 font-medium text-gray-900">Basic salary</label>
          <div class="space-y-6 mt-2">
            <input type="text"
              name="salary"
              required
              placeholder="35,000"
              class="block w-full rounded-md bg-white px-3 py-1 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              value={user.salary}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className='mt-5'>
          <button type="submit" class="text-white bg-[#24292F] hover:bg-[#24292F]/90 focus:ring-4 focus:outline-none focus:ring-[#24292F]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-500 dark:hover:bg-[#050708]/30 me-2 mb-2">
            Add Employee
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddEmployee