import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { getAllEvents, updateEvent, deleteEvent } from '../../services/EventService';
import GetAllEvents from './GetAllEvents';

const eventSchema = Yup.object().shape({
  Event_Name: Yup.string().required('Event name is required'),
  Event_Date: Yup.date().required('Event date is required'),
  Event_Type: Yup.string().required('Event type is required'),
  details: Yup.object().when('Event_Type', {
    is: 'wedding',
    then: Yup.object().shape({
      groomName: Yup.string().required('Groom name is required'),
      brideName: Yup.string().required('Bride name is required'),
      poruwaCeremonyFrom: Yup.string().required('Poruwa start time is required'),
      poruwaCeremonyTo: Yup.string().required('Poruwa end time is required'),
      groomContact: Yup.string().required('Groom contact is required')
    }),
    otherwise: Yup.object().shape({
      eventName: Yup.string().required('Event name is required'),
      contactPersonName: Yup.string().required('Contact person is required'),
      contactPersonNumber: Yup.string().required('Contact number is required')
    })
  })
});

const SeeEvents = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editEvent, setEditEvent] = useState(null);
  const [filters, setFilters] = useState({
    searchQuery: '',
    eventType: 'all',
    year: '',
    month: ''
  });

    // Add click handler for table rows
  const handleRowClick = (event) => {
    setSelectedEvent(event);
  };

  // Close popup handler
  const closePopup = () => {
    setSelectedEvent(null);
  };

  // Date filtering utilities
  const getDateFilters = () => {
    const years = new Set();
    const months = new Set();

    events.forEach(event => {
      const date = new Date(event.Event_Date);
      years.add(date.getFullYear());
      months.add(date.getMonth() + 1);
    });

    return {
      years: Array.from(years).sort(),
      months: Array.from(months).sort((a, b) => a - b)
    };
  };

  const { years, months } = getDateFilters();

  // Filtered events with null safety
  const filteredEvents = events.filter(event => {
    const date = new Date(event.Event_Date);
    const searchTerm = filters.searchQuery.toLowerCase();
    
    const matchesSearch = [
      event.Event_Name,
      event.details?.eventName,
      event.details?.groomName,
      event.details?.brideName,
      event.details?.contactPersonName
    ].some(field => (field || '').toLowerCase().includes(searchTerm));

    return (
      (filters.eventType === 'all' || event.eventType === filters.eventType) &&
      (filters.year === '' || date.getFullYear() === parseInt(filters.year)) &&
      (filters.month === '' || (date.getMonth() + 1) === parseInt(filters.month)) &&
      matchesSearch
    );
  });

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await getAllEvents();
        setEvents(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    loadEvents();
  }, []);

  const handleUpdate = async (values) => {
    try {
      const payload = {
        ...values,
        Event_ID: editEvent.Event_ID
      };
      
      const updatedEvent = await updateEvent(editEvent.Event_ID, payload);
      setEvents(prev => prev.map(event => 
        event.Event_ID === updatedEvent.Event_ID ? updatedEvent : event
      ));
      setEditEvent(null);
      setSuccess('Event updated successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update event');
    }
  };

  const handleDelete = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await deleteEvent(eventId);
        setEvents(prev => prev.filter(event => event.Event_ID !== eventId));
        setSuccess('Event deleted successfully');
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError(err.message || 'Failed to delete event');
      }
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-90">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Status Messages */}
      {error && (
        <div className="bg-red-50 text-red-800 p-4 rounded-lg flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}


            {/* Add popup component */}
      {selectedEvent && (
        <GetAllEvents 
          event={selectedEvent} 
          onClose={closePopup} 
        />
      )}

      {success && (
        <div className="bg-emerald-50 text-emerald-800 p-4 rounded-lg flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          {success}
        </div>
      )}

      {/* Edit Modal */}
      {editEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-2xl w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Edit Event</h3>
            <Formik
              initialValues={{
                Event_Name: editEvent.Event_Name || '',
                Event_Date: new Date(editEvent.Event_Date).toISOString().split('T')[0],
                Event_Type: editEvent.eventType,
                details: {
                  ...editEvent.details,
                  groomName: editEvent.details?.groomName || '',
                  brideName: editEvent.details?.brideName || '',
                  contactPersonName: editEvent.details?.contactPersonName || '',
                  contactPersonNumber: editEvent.details?.contactPersonNumber || '',
                  poruwaCeremonyFrom: editEvent.details?.poruwaCeremonyFrom || '',
                  poruwaCeremonyTo: editEvent.details?.poruwaCeremonyTo || '',
                  groomContact: editEvent.details?.groomContact || ''
                }
              }}
              validationSchema={eventSchema}
              onSubmit={handleUpdate}
            >
              {({ values, isSubmitting }) => (
                <Form className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Event Name</label>
                    <Field
                      name="Event_Name"
                      className="w-full px-4 py-2 rounded-lg border border-gray-200"
                    />
                    <ErrorMessage name="Event_Name" component="div" className="text-red-500 text-sm" />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Event Date</label>
                    <Field
                      type="date"
                      name="Event_Date"
                      className="w-full px-4 py-2 rounded-lg border border-gray-200"
                    />
                    <ErrorMessage name="Event_Date" component="div" className="text-red-500 text-sm" />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Event Type</label>
                    <Field
                      as="select"
                      name="Event_Type"
                      className="w-full px-4 py-2 rounded-lg border border-gray-200"
                      disabled
                    >
                      <option value="wedding">Wedding</option>
                      <option value="custom">Custom Event</option>
                    </Field>
                  </div>

                  {values.Event_Type === 'wedding' ? (
                    <>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium">Groom's Name</label>
                        <Field
                          name="details.groomName"
                          className="w-full px-4 py-2 rounded-lg border border-gray-200"
                        />
                        <ErrorMessage name="details.groomName" component="div" className="text-red-500 text-sm" />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium">Bride's Name</label>
                        <Field
                          name="details.brideName"
                          className="w-full px-4 py-2 rounded-lg border border-gray-200"
                        />
                        <ErrorMessage name="details.brideName" component="div" className="text-red-500 text-sm" />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium">Poruwa Start Time</label>
                        <Field
                          name="details.poruwaCeremonyFrom"
                          className="w-full px-4 py-2 rounded-lg border border-gray-200"
                        />
                        <ErrorMessage name="details.poruwaCeremonyFrom" component="div" className="text-red-500 text-sm" />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium">Poruwa End Time</label>
                        <Field
                          name="details.poruwaCeremonyTo"
                          className="w-full px-4 py-2 rounded-lg border border-gray-200"
                        />
                        <ErrorMessage name="details.poruwaCeremonyTo" component="div" className="text-red-500 text-sm" />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium">Groom Contact</label>
                        <Field
                          name="details.groomContact"
                          className="w-full px-4 py-2 rounded-lg border border-gray-200"
                        />
                        <ErrorMessage name="details.groomContact" component="div" className="text-red-500 text-sm" />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium">Contact Person</label>
                        <Field
                          name="details.contactPersonName"
                          className="w-full px-4 py-2 rounded-lg border border-gray-200"
                        />
                        <ErrorMessage name="details.contactPersonName" component="div" className="text-red-500 text-sm" />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium">Contact Number</label>
                        <Field
                          name="details.contactPersonNumber"
                          className="w-full px-4 py-2 rounded-lg border border-gray-200"
                        />
                        <ErrorMessage name="details.contactPersonNumber" component="div" className="text-red-500 text-sm" />
                      </div>
                    </>
                  )}

                  <div className="flex gap-4 mt-6">
                    <button
                      type="button"
                      onClick={() => setEditEvent(null)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50"
                    >
                      {isSubmitting ? 'Updating...' : 'Update'}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}

      {/* Events Table */}
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="w-full md:w-64">
            <select
              value={filters.eventType}
              onChange={(e) => setFilters({ ...filters, eventType: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm"
            >
              <option value="all">All Events</option>
              <option value="wedding">Weddings</option>
              <option value="custom">Custom Events</option>
            </select>
          </div>

          <div className="w-32">
            <select
              value={filters.year}
              onChange={(e) => setFilters({ ...filters, year: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm"
            >
              <option value="">All Years</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          <div className="w-32">
            <select
              value={filters.month}
              onChange={(e) => setFilters({ ...filters, month: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm"
            >
              <option value="">All Months</option>
              {months.map(month => (
                <option key={month} value={month}>
                  {new Date(2000, month - 1).toLocaleString('default', { month: 'short' })}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1 md:flex-none md:w-64">
            <input
              type="text"
              placeholder="Search events..."
              value={filters.searchQuery}
              onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
                 <tbody className="bg-white divide-y divide-gray-200">
        {filteredEvents.map(event => (
          <tr 
            key={event.Event_ID} 
            className="hover:bg-gray-50 transition-colors cursor-pointer"
            onClick={() => handleRowClick(event)}
          >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {event.eventType === 'wedding'
                      ? `${event.details?.groomName || 'N/A'} & ${event.details?.brideName || 'N/A'}`
                      : event.details?.eventName || event.Event_Name || 'Untitled Event'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2.5 py-1.5 text-xs font-medium capitalize rounded-full bg-purple-100 text-purple-800">
                      {event.eventType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(event.Event_Date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: '2-digit',
                      year: 'numeric'
                    })}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {event.eventType === 'wedding' ? (
                      <div className="space-y-1">
                        <p>Poruwa: {event.details?.poruwaCeremonyFrom || 'N/A'} - {event.details?.poruwaCeremonyTo || 'N/A'}</p>
                        <p>Contact: {event.details?.groomContact || 'N/A'}</p>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <p>Contact: {event.details?.contactPersonName || 'N/A'}</p>
                        <p>Phone: {event.details?.contactPersonNumber || 'N/A'}</p>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => setEditEvent(event)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(event.Event_ID)}
                      className="text-red-600 hover:text-red-900"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
              {filteredEvents.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    {events.length === 0 ? 'No events found' : 'No matching events found'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SeeEvents;