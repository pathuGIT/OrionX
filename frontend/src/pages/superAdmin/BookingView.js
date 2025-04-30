import React, { useEffect, useState, useRef } from 'react';
import { addVenue, getAllVenues, deleteVenueById, updateVenueById } from '../../services/VenueService';
import { BuildingOffice2Icon, ClockIcon, MapPinIcon, UserGroupIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

const BookingView = () => {
  const [viewAction, setViewAction] = useState(true);
  const [venues, setVenues] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [editRowId, setEditRowId] = useState(null);
  const [editVenueData, setEditVenueData] = useState({});
  const [viewAddRaw, setViewAddRaw] = useState(false);
  const dropdownRef = useRef(null);

  const toggleAction = () => {
    setViewAction((prev) => !prev);
  };

  // Hide dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        event.target.id !== "dropdownActionButton"
      ) {
        setViewAction(true); // Hide dropdown
      }
    };
    if (!viewAction) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [viewAction]);

  // Load all venues when page loads
  useEffect(() => {
    fetchVenues();
    if (viewAddRaw != false) {
      setEditVenueData({});
    }
  }, [viewAddRaw]);

  const fetchVenues = async () => {
    try {
      const data = await getAllVenues();
      setVenues(data);
      console.log(venues);
    } catch (error) {
      console.error('Error fetching venues:', error);
    }
  };

  const handleCheckboxChange = (venueId) => {
    setSelectedIds((prev) =>
      prev.includes(venueId)
        ? prev.filter((id) => id !== venueId)
        : [...prev, venueId]
    );
  };

  const deleteAllTikBox = async () => {
    setViewAction(true)
    console.log("lalal")
    if (window.confirm('Are you sure you want to delete this venue?')) {
      try {
        for (const id of selectedIds) {
          await deleteVenueById(id);
        }

        fetchVenues();
        setSelectedIds([])
      } catch (error) {
        console.error('Error deleting venue:', error);
      }
    }
  }

  const handleEdit = (venue) => {
    setEditRowId(venue.venue_id);
    setEditVenueData({
      venue_name: venue.venue_name,
      time_slot: venue.time_slot,
      Location: venue.Location,
      min_capacity: venue.min_capacity,
      max_capacity: venue.max_capacity,
      price: venue.price,
    });
  };

  const handleEditVenueChange = (field, value) => {
    setEditVenueData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUpdate = async (venue_id) => {
    if (window.confirm(`Are you sure you want to ${venue_id == 0 ? 'Add' : 'Update'} this venue?`)) {
      try {
        // Prepare payload for update
        const payload = {
          name: editVenueData.venue_name,
          time: editVenueData.time_slot,
          location: editVenueData.Location,
          minCapacity: Number(editVenueData.min_capacity),
          maxCapacity: Number(editVenueData.max_capacity),
          price: Number(editVenueData.price),
        };
        // You should have an updateVenueById service method
        if (venue_id == 0) {
          console.log("aaa")
          await addVenue(payload);
        }
        if (venue_id != 0) await updateVenueById(venue_id, payload);
        setEditRowId(null);
        setEditVenueData({
          venue_name: null,
          time_slot: null,
          Location: null,
          min_capacity: null,
          max_capacity: null,
          price: null,
        });
        fetchVenues();
      } catch (error) {
        console.error('Error Adding venue:', error);
      }
    }
  };

  return (
    <div class="relative overflow-x-auto shadow-md sm:rounded-lg mt-5">
      <div class="flex items-center justify-between flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4 bg-white dark:bg-gray-900 p-5">
        <div>
          {/* buuton for dropdown */}
          <button
            onClick={toggleAction}
            class="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700" type="button">
            Action
            <svg class="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4" />
            </svg>
          </button>

          {/* Dropdown positioned absolutely below the button */}
          <div
            ref={dropdownRef}
            id="dropdownAction"
            class={`z-10 ${!viewAction ? 'block absolute mt-2' : 'hidden'} bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700 dark:divide-gray-600`}
            style={{ minWidth: '11rem' }}
          >
            <ul class="py-1 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownActionButton">
              <li>
                <a href="#" onClick={() => { setViewAddRaw(true); setViewAction(true); }} class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">New Venue</a>
              </li>
            </ul>
            <div class="py-1">
              <a href="#" onClick={() => { deleteAllTikBox(); setViewAction(true); }} class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Delete Venues</a>
            </div>
          </div>
        </div>

        <label for="table-search" class="sr-only">Search</label>
        <div class="relative">
          <div class="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
            </svg>
          </div>
          <input type="text" id="table-search-users" class="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search for users" />
        </div>
      </div>

      <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" class="p-4">
              <div class="flex items-center">
                <input id="checkbox-all-search" type="checkbox" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                <label for="checkbox-all-search" class="sr-only">checkbox</label>
              </div>
            </th>
            <th className='px-6 py-3'>Name</th>
            <th className='px-6 py-3'>Time</th>
            <th className='px-6 py-3'>Location</th>
            <th className='px-6 py-3'>Min Capacity</th>
            <th className='px-6 py-3'>Max Capacity</th>
            <th className='px-6 py-3'>Price</th>
            <th className='px-6 py-3'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* Table raw for adding new venue */}
          <tr class={`${viewAddRaw == false ? 'hidden' : 'visible'}  bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600`}>
            <td class="w-4 p-4">
              <div class="flex items-center">
                <input type="checkbox" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
              </div>
            </td>
            <td class="px-6 py-4">
              <input type="text" value={editVenueData.venue_name} onChange={(e) => handleEditVenueChange('venue_name', e.target.value)} className="border rounded px-2 py-1" size="15" />
            </td>
            <td class="px-6 py-4">
              <select value={editVenueData.time_slot} onChange={(e) => handleEditVenueChange('time_slot', e.target.value)} className="border rounded px-2 py-1">
                <option value="">Default</option>
                <option value="day">day</option>
                <option value="night">night</option>
              </select>
            </td>
            <td class="px-6 py-4">
              <select value={editVenueData.Location} onChange={(e) => handleEditVenueChange('Location', e.target.value)} className="border rounded px-2 py-1">
                <option value="">Default</option>
                <option value="indoor">indoor</option>
                <option value="outdoor">outdoor</option>
                <option value="both">both</option>
              </select>
            </td>
            <td class="px-6 py-4">
              <input type="text" value={editVenueData.min_capacity} onChange={(e) => handleEditVenueChange('min_capacity', e.target.value)} className="border rounded px-2 py-1" size="1" />
            </td>
            <td class="px-6 py-4">
              <input type="text" value={editVenueData.max_capacity} onChange={(e) => handleEditVenueChange('max_capacity', e.target.value)} className="border rounded px-2 py-1" size="1" />
            </td>
            <td class="px-6 py-4">
              <input type="text" value={editVenueData.price} onChange={(e) => handleEditVenueChange('price', e.target.value)} className="border rounded px-2 py-1" size="10" />
            </td>
            <td class="px-6 py-4">
              <button onClick={() => handleUpdate(0)} className='bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded mr-2'>Add</button>
              <button onClick={() => { setViewAddRaw(false) }} className='bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded' >Cancel</button>
            </td>
          </tr>
          {venues.map((venue) => (
            <tr key={venue.venue_id} class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
              <td class="w-4 p-4">
                <div class="flex items-center">
                  <input
                    id={`checkbox-table-search-${venue.venue_id}`}
                    type="checkbox"
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    checked={selectedIds.includes(venue.venue_id)}
                    onChange={() => handleCheckboxChange(venue.venue_id)}
                  />
                </div>
              </td>
              {editRowId === venue.venue_id ? (
                <>
                  <td class="px-6 py-4">
                    <input
                      type="text"
                      value={editVenueData.venue_name}
                      onChange={(e) => handleEditVenueChange('venue_name', e.target.value)}
                      className="border rounded px-2 py-1"
                      size="15"
                    />
                  </td>
                  <td class="px-6 py-4">
                    <select
                      value={editVenueData.time_slot}
                      onChange={(e) => handleEditVenueChange('time_slot', e.target.value)}
                      className="border rounded px-2 py-1"
                    >
                      <option value="day">day</option>
                      <option value="night">night</option>
                    </select>
                  </td>
                  <td class="px-6 py-4">
                    <select
                      value={editVenueData.Location}
                      onChange={(e) => handleEditVenueChange('Location', e.target.value)}
                      className="border rounded px-2 py-1"
                    >
                      <option value="indoor">indoor</option>
                      <option value="outdoor">outdoor</option>
                      <option value="both">both</option>
                    </select>
                  </td>
                  <td class="px-6 py-4">
                    <input
                      type="text"
                      value={editVenueData.min_capacity}
                      onChange={(e) => handleEditVenueChange('min_capacity', e.target.value)}
                      className="border rounded px-2 py-1"
                      size="1"
                    />
                  </td>
                  <td class="px-6 py-4">
                    <input
                      type="text"
                      value={editVenueData.max_capacity}
                      onChange={(e) => handleEditVenueChange('max_capacity', e.target.value)}
                      className="border rounded px-2 py-1"
                      size="1"
                    />
                  </td>
                  <td class="px-6 py-4">
                    <input
                      type="text"
                      value={editVenueData.price}
                      onChange={(e) => handleEditVenueChange('price', e.target.value)}
                      className="border rounded px-2 py-1"
                      size="10"
                    />
                  </td>
                  <td class="px-6 py-4">
                    <button
                      onClick={() => handleUpdate(venue.venue_id)}
                      className='bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded mr-2'
                    >
                      Update
                    </button>
                    <button
                      onClick={() => setEditRowId(null)}
                      className='bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded'
                    >
                      Cancel
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td class="px-6 py-4">{venue.venue_name}</td>
                  <td class="px-6 py-4">{venue.time_slot}</td>
                  <td class="px-6 py-4">{venue.Location}</td>
                  <td class="px-6 py-4">{venue.min_capacity}</td>
                  <td class="px-6 py-4">{venue.max_capacity}</td>
                  <td class="px-6 py-4">RS.{venue.price}</td>
                  <td class="px-6 py-4">
                    <button
                      onClick={() => handleEdit(venue)}
                      className='bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded'
                    >
                      Edit
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}

        </tbody>
      </table>
    </div>

  )
}

export default BookingView