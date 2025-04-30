
import React, { useEffect, useState } from 'react';
import { addVenue, getAllVenues, deleteVenueById } from '../../services/VenueService';
import { BuildingOffice2Icon, ClockIcon, MapPinIcon, UserGroupIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

const VenueView = () => {
  const [venues, setVenues] = useState([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    time: 'day',
    location: '',
    minCapacity: '',
    maxCapacity: '',
    price: '',
  });

  // Load all venues when page loads
  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    try {
      const data = await getAllVenues();
      setVenues(data);
      console.log(venues);
    } catch (error) {
      console.error('Error fetching venues:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsModalOpen(false); // Close modal after submit
    try {
      // convert minCapacity, maxCapacity, price to numbers
      const payload = {
        ...formData,
        minCapacity: Number(formData.minCapacity),
        maxCapacity: Number(formData.maxCapacity),
        price: Number(formData.price),
      };
      await addVenue(payload);
      setFormData({
        name: '',
        time: 'day',
        location: 'indoor',
        minCapacity: '',
        maxCapacity: '',
        price: '',
      });
      fetchVenues();
    } catch (error) {
      console.error('Error adding venue:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this venue?')) {
      try {
        await deleteVenueById(id);
        fetchVenues();
      } catch (error) {
        console.error('Error deleting venue:', error);
      }
    }
  };

  return (
    
    <div className="h-screen flex flex-col">
      {/* Top Part - Form (1/4 height) */}
      <div className="h-1/4 bg-white shadow-md flex items-center justify-center">
        <form onSubmit={handleSubmit} className="w-full max-w-2xl grid grid-cols-3 gap-4 items-center px-6">

          <div className="col-span-1 text-right font-semibold text-gray-700">Name</div>
          <div className="col-span-2 flex items-center border rounded-md px-3">
            <input
              className="flex-1 py-1 outline-none"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-span-1 text-right font-semibold text-gray-700">Time Slot</div>
          <div className="col-span-2 flex items-center border rounded-md px-3">
            <select
              className="flex-1 py-1 outline-none bg-transparent"
              name="time"
              value={formData.time}
              onChange={handleChange}
            >
              <option value="day">Day</option>
              <option value="night">Night</option>
            </select>
          </div>

          <div className="col-span-1 text-right font-semibold text-gray-700">Location</div>
          <div className="col-span-2 flex items-center border rounded-md px-3">
            <select
              className="flex-1 py-1 outline-none bg-transparent"
              name="location"
              value={formData.location}
              onChange={handleChange}
            >
              <option value="indoor">Indoor</option>
              <option value="outdoor">Outdoor</option>
            </select>
          </div>

          <div className="col-span-1 text-right font-semibold text-gray-700">Min Capacity</div>
          <div className="col-span-2 flex items-center border rounded-md px-3">
            <input
              className="flex-1 py-1 outline-none"
              type="number"
              name="minCapacity"
              value={formData.minCapacity}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-span-1 text-right font-semibold text-gray-700">Max Capacity</div>
          <div className="col-span-2 flex items-center border rounded-md px-3">
            <input
              className="flex-1 py-1 outline-none"
              type="number"
              name="maxCapacity"
              value={formData.maxCapacity}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-span-1 text-right font-semibold text-gray-700">Price</div>
          <div className="col-span-2 flex items-center border rounded-md px-3">
            <input
              className="flex-1 py-1 outline-none"
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-span-3 text-center pt-2">
            <button
              className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-8 py-2 rounded-md transition"
              type="submit"
            >
              Add Venue
            </button>
          </div>
        </form>
      </div>

      {/* Bottom Part - Data (3/4 height) */}
      <div className="h-3/4 overflow-y-scroll p-6 bg-gray-100">
        {/* Example data list */}
        <h2 className="text-xl font-bold mb-4">Venue List</h2>
        <div className="space-y-4">
          {venues.length === 0 ? (
            <p>No venues available.</p>
          ) : (
            <table className='w-full text-left'>
              <thead>
                <tr>
                  <th className='border px-4 py-2'>Name</th>
                  <th className='border px-4 py-2'>Time</th>
                  <th className='border px-4 py-2'>Location</th>
                  <th className='border px-4 py-2'>Min Capacity</th>
                  <th className='border px-4 py-2'>Max Capacity</th>
                  <th className='border px-4 py-2'>Price</th>
                  <th className='border px-4 py-2'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {venues.map((venue) => (
                  <tr key={venue.venue_id}>
                    <td className='border px-4 py-2'>{venue.venue_name}</td>
                    <td className='border px-4 py-2'>{venue.time_slot}</td>
                    <td className='border px-4 py-2'>{venue.Location}</td>
                    <td className='border px-4 py-2'>{venue.min_capacity}</td>
                    <td className='border px-4 py-2'>{venue.max_capacity}</td>
                    <td className='border px-4 py-2'>${venue.price}</td>
                    <td className='border px-4 py-2'>
                      <button
                        onClick={() => handleDelete(venue.venue_id)}
                        className='bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded'
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>

  );
};

export default VenueView;
