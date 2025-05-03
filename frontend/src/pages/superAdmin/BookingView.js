import React, { useState, useEffect } from 'react';
import BookingService from '../../services/BookngService';
import { getAllVenues } from '../../services/VenueService';

const BookingView = () => {

  const [form, setForm] = useState({
    date: '', 
    slot: 'day', 
    customerId: 'CU000003', 
    guests: 150,
    venueId: '', 
    extraHours: 0, 
    payDeposit: false
  });
  const [result, setResult] = useState(null);
  const [venues, setvenues] = useState([])
  
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

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(frm => ({
      ...frm,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      console.log("sasas",form);
      const res = await BookingService.createBooking(form);
      setResult(`Booking created: ${res.data.booking_id}`);
    } catch (err) {
      setResult('Error creating booking');
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">New Booking</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Event Date</label>
          <input type="date" name="date" value={form.date}
            onChange={handleChange}
            className="w-full p-2 border rounded" required />
        </div>
        <div className="flex space-x-4">
          <div className="flex-1">
            <label className="block mb-1">Time Slot</label>
            <select name="slot" value={form.slot} onChange={handleChange}
              className="w-full p-2 border rounded">
              <option value="day">Day</option>
              <option value="night">Night</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block mb-1">Guests</label>
            <input type="number" name="guests" min={1} value={form.guests}
              onChange={handleChange}
              className="w-full p-2 border rounded" required />
          </div>
        </div>
        <div>
          <label className="block mb-1">Venue</label>
          <select name="venueId" value={form.venueId} onChange={handleChange}
            className="w-full p-2 border rounded" required>

            <option value="">-- Select Venue --</option>
            {venues.map((venue) => (
              <option key={venue.venue_id} value={venue.venue_id}>{venue.venue_name}</option>
            ))}  
          </select>
        </div>
        <div>
          <label className="flex items-center">
            <input type="checkbox" name="payDeposit"
              checked={form.payDeposit}
              onChange={handleChange}
              className="mr-2" />
            Pay Key Money Deposit (Rs.50,000)
          </label>
        </div>
        <div>
          <label className="block mb-1">Additional Hours</label>
          <input type="number" name="extraHours" min={0} value={form.extraHours}
            onChange={handleChange}
            className="w-32 p-2 border rounded" />
        </div>
        <button type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition">
          Create Booking
        </button>
      </form>
      {result && <p className="mt-4 text-center">{result}</p>}
    </div>
  );
};

export default BookingView;