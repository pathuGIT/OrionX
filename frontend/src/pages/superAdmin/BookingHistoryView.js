import React, { useState, useEffect } from 'react';
import { addCustomer } from '../../services/CustomerServise';
import BookingService from '../../services/BookngService';
import { getAllVenues } from '../../services/VenueService';

const BookingHistoryView = () => {
  const [customer, setCustomer] = useState({ name: '', email: '', address: '', phone: '' });
  const [customerSuccess, setCustomerSuccess] = useState(false);
  const [errmsg, setErrmsg] = useState({ msg: '', color: '' });
  const [btnText, setBtnText] = useState("Add Customer");
  const [customerIdMsg, setCustomerIdMsg] = useState("");
  const [cusres, setCusres] = useState("");
  const [addedCustomer, setAddedCustomer] = useState(null);
  const [venues, setvenues] = useState([]);
  const [result, setResult] = useState(null);

  useEffect(() => {
      fetchVenues();
  }, []);

  const fetchVenues = async () => {
    try {
      const res = await getAllVenues();
      setvenues(res);
    } catch (err) {
      console.error('Error fetching venues:', err);
    } 
  }

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

  const handleBookingChange = e => {
    const { name, value, type, checked } = e.target;
    setBooking(frm => ({
      ...frm,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const submitCustomer = async (e) => {
    e.preventDefault();
    setErrmsg({ msg: '', color: '' });
    const isValid = Object.keys(customer).every((key) => validateField(key, customer[key]));
    if (!isValid) return;

    setBtnText("Adding...");
    try {
      const res = await addCustomer(customer);

      // Set customerIdMsg directly from response
      setCustomerIdMsg(res.cus_id.customer_id);
      setCusres(res.cus_id.customer_id);

      setCustomerSuccess(true);
      setAddedCustomer(customer); // Save added customer for placeholders
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
      setBtnText("Add Customer");
    }
  };

  
  const [booking, setBooking] = useState({
      date: '', 
      slot: 'day', 
      customerId: cusres, // get customer ID from local storage
      guests: 150,
      venueId: '', 
      extraHours: 0, 
      payDeposit: false
    });  

  // Sync booking.customerId with cusres
  useEffect(() => {
    if (cusres) {
      setBooking(prev => ({
        ...prev,
        customerId: cusres
      }));
    }
  }, [cusres]);

  const submitBooking = async (e) => {
    e.preventDefault();
    try {
      console.log("sasas",booking);
      const res = await BookingService.createBooking(booking);
      setResult(`Booking created: ${res.data.booking_id}`);
    } catch (err) {
      setResult('Error creating booking');
    }
  };

  const inputClass = "bg-white border border-gray-300 text-gray-900 placeholder-gray-500 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none";

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-2xl font-semibold text-gray-800 mb-6">Customer Information</h3>
        <p className={`text-center mb-4 ${errmsg.color} ${errmsg.color === 'text-green-600' ? 'hidden':'visible'}`}>{errmsg.msg}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label htmlFor="name" className="text-gray-700 text-sm mb-1">Full Name</label>
            <input id="name" type="text" name="name" placeholder={addedCustomer?.name || "e.g. Shahan Aththalage"} value={customer.name} onChange={handleCustomerChange} className={inputClass} />
          </div>
          <div className="flex flex-col">
            <label htmlFor="email" className="text-gray-700 text-sm mb-1">Email Address</label>
            <input id="email" type="email" name="email" placeholder={addedCustomer?.email || "e.g. example@gmail.com"} value={customer.email} onChange={handleCustomerChange} className={inputClass} />
          </div>
          <div className="flex flex-col">
            <label htmlFor="phone" className="text-gray-700 text-sm mb-1">Phone Number</label>
            <input id="phone" type="text" name="phone" placeholder={addedCustomer?.phone || "e.g. 0712345678"} value={customer.phone} onChange={handleCustomerChange} className={inputClass} />
          </div>
          <div className="flex flex-col md:col-span-2">
            <label htmlFor="address" className="text-gray-700 text-sm mb-1">Address</label>
            <input id="address" type="text" name="address" placeholder={addedCustomer?.address || "e.g. No:xx, Saddathissa Road, Galle"} value={customer.address} onChange={handleCustomerChange} className={inputClass} />
          </div>
        </div>
        <div className="mt-6">
          {!customerSuccess && (
            <button onClick={submitCustomer} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-xl shadow-md transition">
              {btnText}
            </button>
          )}
          {customerSuccess && (
            <div className="mt-4">
              <div className="flex items-center text-green-600 text-sm">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
                </svg>
                Successfully added customer.
              </div>
              <div className="mt-1 text-sm text-green-700">{customerIdMsg}</div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-2xl font-semibold text-gray-800 mb-6">Booking Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label htmlFor="booking_date" className="text-gray-700 text-sm mb-1">Booking Date</label>
            <input id="booking_date" type="date" name="date" value={booking.date} onChange={handleBookingChange} className={inputClass} />
          </div>
          <div className="flex flex-col">
            <label htmlFor="slot" className="text-gray-700 text-sm mb-1">Time Slot</label>
            <select id="time_slot" name="slot" value={booking.slot} onChange={handleBookingChange} className={inputClass}>
              <option value="day">Day</option>
              <option value="night">Night</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label htmlFor="venue_id" className="text-gray-700 text-sm mb-1">Venue</label>
            <select id="venue_id" name="venueId" value={booking.venueId} onChange={handleBookingChange} className={inputClass}>
              <option value="">-- Select Venue --</option>
              {venues.map((venue) => (
                <option key={venue.venue_id} value={venue.venue_id}>{venue.venue_name}</option>
              ))} 
            </select>
          </div>
          <div className="flex flex-col">
            <label htmlFor="number_of_guests" className="text-gray-700 text-sm mb-1">Number of Guests</label>
            <input id="number_of_guests" type="number" name="guests" placeholder="0" value={booking.guests} onChange={handleBookingChange} className={inputClass} />
          </div>
          <div className="flex flex-col">
            <label htmlFor="additional_hours" className="text-gray-700 text-sm mb-1">Additional Hours</label>
            <input type="number" name="extraHours" min={0} value={booking.extraHours}
            onChange={handleBookingChange}
            className="w-32 p-2 border rounded" />  
          </div>
        </div>
        <label className="flex items-center mt-4">
          <input type="checkbox" name="payDeposit" id="pay_deposit" checked={booking.payDeposit} onChange={handleBookingChange} className="h-5 w-5 text-blue-500 rounded focus:ring-2 focus:ring-blue-500 outline-none" />
          <span className="ml-3 text-gray-700 text-sm">Pay Key Money Deposit (Rs. 50,000)</span>
        </label>
        <button onClick={submitBooking} className="mt-6 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-xl shadow-md transition">
          Create Booking
        </button>
      </div>
      {result && <p className="mt-4 text-center">{result}</p>}
    </div>
  );
};

export default BookingHistoryView;
