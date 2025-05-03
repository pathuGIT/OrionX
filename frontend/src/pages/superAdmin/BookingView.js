import React, { useState, useEffect, Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { ChevronUpDownIcon, CheckIcon } from '@heroicons/react/20/solid';
import { addCustomer } from '../../services/CustomerServise';
import BookingService from '../../services/BookngService';
import { getAllVenues } from '../../services/VenueService';

const VenueDropdown = ({ venues, booking, setBooking }) => {
  const selectedVenue = venues.find(v => v.venue_id === booking.venueId) || null;

  return (
    <div className="flex flex-col">
      <label htmlFor="venue_id" className="text-gray-700 text-sm mb-1">Venue</label>
      <Listbox
        value={selectedVenue}
        onChange={(venue) => setBooking(b => ({ ...b, venueId: venue?.venue_id || '' }))}
      >
        <div className="relative">
          <Listbox.Button className="w-full cursor-pointer rounded-xl bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm">
            <span className="block truncate">
              {selectedVenue
                ? `${selectedVenue.venue_name} (${selectedVenue.time_slot})`
                : '-- Select Venue --'}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </span>
          </Listbox.Button>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {venues.map((venue) => (
                <Listbox.Option
                  key={venue.venue_id}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                      active ? 'bg-blue-100 text-blue-900' : 'text-gray-700'
                    }`
                  }
                  value={venue}
                >
                  {({ selected }) => (
                    <div className='border-b-2'>
                      <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                        {venue.venue_name}
                      </span>
                      <tr className=" text-xs text-gray-500 ml-5">
                        <td className='px-2'>{venue.venue_id}</td>
                        <td className='px-2'> {venue.time_slot.charAt(0).toUpperCase() + venue.time_slot.slice(1)}</td>
                        <td className='px-2'> {venue.Location}</td>
                      </tr>
                      {selected && (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      )}
                    </div>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};

const BookingView = () => {
  const [customer, setCustomer] = useState({ name: '', email: '', address: '', phone: '' });
  const [customerSuccess, setCustomerSuccess] = useState(false);
  const [bookSuccess, setBookSuccess] = useState(false);
  const [errmsg, setErrmsg] = useState({ msg: '', color: '' });
  const [bErrmsg, setBErrmsg] = useState({ msg: '', color: '' });
  const [btnText, setBtnText] = useState('Add Customer');
  const [btnBookingText, setBtnBookingText] = useState('Add Booking');
  const [customerIdMsg, setCustomerIdMsg] = useState("");
  const [cusres, setCusres] = useState('');
  const [addedCustomer, setAddedCustomer] = useState(null);
  const [venues, setVenues] = useState([]);
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    try {
      const res = await getAllVenues();
      setVenues(res);
    } catch (err) {
      console.error('Error fetching venues:', err);
    }
  };

  const validateField = (name, value) => {
    let error = { msg: '', color: '' };
    switch (name) {
      case 'name':
        if (/[^a-zA-Z\s]/.test(value)) {
          error = { msg: 'Name must not contain numbers or symbols.', color: 'text-red-600' };
        }
        break;
      case 'phone':
        if (!/^\d{10}$/.test(value)) {
          error = { msg: 'Phone number must contain exactly 10 digits.', color: 'text-red-600' };
        }
        break;
      case 'email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = { msg: 'Invalid email address.', color: 'text-red-600' };
        }
        break;
      case 'address':
        if (value.trim() === '') {
          error = { msg: 'Address cannot be empty.', color: 'text-red-600' };
        }
        break;
      default:
        break;
    }
    setErrmsg(error);
    return error.msg === '';
  };

  const handleCustomerChange = (e) => {
    const { name, value } = e.target;
    setCustomer(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const submitCustomer = async (e) => {
    e.preventDefault();
    setErrmsg({ msg: '', color: '' });
    const isValid = Object.keys(customer).every((key) =>
      validateField(key, customer[key])
    );
    if (!isValid) return;

    setBtnText('Adding...');
    try {
      const res = await addCustomer(customer);
      const newId = res.cus_id.customer_id;
      setCusres(newId);
      setCustomerSuccess(true);
      setAddedCustomer(customer);
      setCustomer({ name: '', email: '', address: '', phone: '' });
      setErrmsg({ msg: res.message || 'Customer added!', color: 'text-green-600' });
      setCustomerIdMsg(res.message);
    } catch (err) {
      console.error(err);
      if (err.response?.data?.message) {
        setErrmsg({ msg: err.response.data.message, color: 'text-red-600' });
      } else {
        setErrmsg({ msg: 'An unexpected error occurred.', color: 'text-red-600' });
      }
    } finally {
      setBtnText('Add Customer');
    }
  };

  const [booking, setBooking] = useState({
    date: '',
    slot: 'day',
    customerId: '',
    guests: 150,
    venueId: '',
    extraHours: 0,
    payDeposit: false,
  });

  // Sync booking.customerId when cusres changes
  useEffect(() => {
    if (cusres) {
      setBooking(b => ({ ...b, customerId: cusres }));
    }
  }, [cusres]);

  const handleBookingChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBooking(frm => ({
      ...frm,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const submitBooking = async (e) => {
    e.preventDefault();
    setBtnBookingText("Adding...")
    try {
      if(booking.customerId) {
        const res = await BookingService.createBooking(booking);
        setBookSuccess(true);
        console.log("mawe:",res);
        setResult(`Successfully booking created: ${res.booking_id}`);
        setBErrmsg({ msg: '', color: 'text-red-600' });
      }else{
        setBErrmsg({ msg: 'Customer ID is required to create a booking. Create a new customer first!!', color: 'text-red-600' });
      }
    } catch (err) {
      setResult('Error creating booking');
      console.error(err);
      if (err.response?.data?.message) {
        setBErrmsg({ msg: err.response.data.message, color: 'text-red-600' });
      } else {
        setBErrmsg({ msg: 'An unexpected error occurred.', color: 'text-red-600' });
      }
    }finally{
      setBtnBookingText("Add Booking");
    }
  };

  const inputClass =
    'bg-white border border-gray-300 text-gray-900 placeholder-gray-500 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none';

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      {/* Customer Form */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Customer Information</h3>
        <p
          className={`${errmsg.color} text-center mb-4 ${
            errmsg.color === 'text-green-600' ? 'hidden' : 'visible'
          }`}
        >
          {errmsg.msg}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name */}
          <div className="flex flex-col">
            <label htmlFor="name" className="text-gray-700 text-sm mb-1">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={customer.name}
              onChange={handleCustomerChange}
              placeholder={addedCustomer?.name || 'e.g. Shahan Aththalage'}
              className={inputClass}
            />
          </div>
          {/* Email */}
          <div className="flex flex-col">
            <label htmlFor="email" className="text-gray-700 text-sm mb-1">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              value={customer.email}
              onChange={handleCustomerChange}
              placeholder={addedCustomer?.email || 'e.g. example@gmail.com'}
              className={inputClass}
            />
          </div>
          {/* Phone */}
          <div className="flex flex-col">
            <label htmlFor="phone" className="text-gray-700 text-sm mb-1">Phone Number</label>
            <input
              id="phone"
              name="phone"
              type="text"
              value={customer.phone}
              onChange={handleCustomerChange}
              placeholder={addedCustomer?.phone || 'e.g. 0712345678'}
              className={inputClass}
            />
          </div>
          {/* Address */}
          <div className="flex flex-col md:col-span-2">
            <label htmlFor="address" className="text-gray-700 text-sm mb-1">Address</label>
            <input
              id="address"
              name="address"
              type="text"
              value={customer.address}
              onChange={handleCustomerChange}
              placeholder={
                addedCustomer?.address || 'e.g. No: xx, Saddathissa Road, Galle'
              }
              className={inputClass}
            />
          </div>
        </div>
        <div className="mt-6">
          {!customerSuccess ? (
            <button
              onClick={submitCustomer}
              className="bg-zinc-300 border hover:bg-slate-50 hover:border-black text-black font-medium py-2 px-6 rounded-md"
            >
              {btnText}
            </button>
          ) : (
            <div className="mt-4">
              <div className="flex items-center text-green-600 text-sm">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Successfully added customer.
              </div>
              <div className="mt-1 text-sm text-green-700">{customerIdMsg}</div>
            </div>
          )}
        </div>
      
       {/* Booking form */}
        <h3 className="text-lg font-semibold text-gray-800 mb-6 mt-10">Booking Information</h3>
        <p
          className={`${bErrmsg.color} text-center mb-4 ${
            bErrmsg.color === 'text-green-600' ? 'hidden' : 'visible'
          }`}
        >
          {bErrmsg.msg}
        </p>
        <form onSubmit={submitBooking} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Date */}
            <div className="flex flex-col">
              <label htmlFor="booking_date" className="text-gray-700 text-sm mb-1">
                Booking Date
              </label>
              <input
                id="booking_date"
                name="date"
                type="date"
                required
                value={booking.date}
                onChange={handleBookingChange}
                className={inputClass}
              />
            </div>

            {/* Slot */}
            <div className="flex flex-col">
              <label htmlFor="slot" className="text-gray-700 text-sm mb-1">
                Time Slot
              </label>
              <select
                id="slot"
                name="slot"
                required
                value={booking.slot}
                onChange={handleBookingChange}
                className={inputClass}
              >
                <option value="day">Day</option>
                <option value="night">Night</option>
              </select>
            </div>

            {/* Venue Dropdown */}
            <VenueDropdown venues={venues} booking={booking} setBooking={setBooking} />

            {/* Guests */}
            <div className="flex flex-col">
              <label htmlFor="number_of_guests" className="text-gray-700 text-sm mb-1">
                Number of Guests
              </label>
              <input
                id="number_of_guests"
                name="guests"
                type="number"
                required
                value={booking.guests}
                onChange={handleBookingChange}
                className={inputClass}
              />
            </div>

            {/* Extra Hours */}
            <div className="flex flex-col">
              <label htmlFor="additional_hours" className="text-gray-700 text-sm mb-1">
                Additional Hours
              </label>
              <input
                id="additional_hours"
                name="extraHours"
                type="number"
                min={0}
                value={booking.extraHours}
                onChange={handleBookingChange}
                className="w-32 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Deposit */}
          <label className="flex items-center mt-4">
            <input
              id="pay_deposit"
              name="payDeposit"
              type="checkbox"
              checked={booking.payDeposit}
              onChange={handleBookingChange}
              className="h-5 w-5 text-blue-500 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <span className="ml-3 text-gray-700 text-sm">
              Pay Key Money Deposit (Rs. 50,000)
            </span>
          </label>

        <div className="mt-6">
          {!bookSuccess ? (
            <button
            type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-md"
            >
              {btnBookingText}
            </button>
          ) : (
            <div className="mt-4">
              <div className="flex items-center text-green-600 text-sm">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Successfully added booking.
              </div>
              <div className="mt-1 text-sm text-green-700">{result}</div>
            </div>
          )}
        </div>

        </form>
        {/* {result && <p className="mt-4 text-center">{result}</p>} */}
      </div>
    </div>
  );
};

export default BookingView;


