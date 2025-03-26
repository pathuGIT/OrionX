import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EventForm = () => {
    const [eventID, setEventID] = useState('');
    const [buffetTimeFrom, setBuffetTimeFrom] = useState('');
    const [buffetTimeTo, setBuffetTimeTo] = useState('');
    const [additionalTime, setAdditionalTime] = useState('');
    const [functionDurationFrom, setFunctionDurationFrom] = useState('');
    const [functionDurationTo, setFunctionDurationTo] = useState('');
    const [teaTableTime, setTeaTableTime] = useState('');
    const [dressTime, setDressTime] = useState('');
    const [bookingID, setBookingID] = useState('');
    const [barRequirementID, setBarRequirementID] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');



    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const eventData = {
            eventID,
            buffetTimeFrom,
            buffetTimeTo,
            additionalTime,
            functionDurationFrom,
            functionDurationTo,
            teaTableTime,
            dressTime,
            bookingID,
            barRequirementID
        };

        try {
            const response = await axios.post('http://localhost:8000/api/events', eventData);
            setSuccess(response.data.message);
            setEventID('');
            setBuffetTimeFrom('');
            setBuffetTimeTo('');
            setAdditionalTime('');
            setFunctionDurationFrom('');
            setFunctionDurationTo('');
            setTeaTableTime('');
            setDressTime('');
            setBookingID('');
            setBarRequirementID('');
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred while creating the event.');
        }
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-gray-100 rounded-lg shadow-md text-center">
            <h2 className="text-2xl font-bold mb-4">Create Event</h2>
            {error && <p className="text-red-600">{error}</p>}
            {success && <p className="text-green-600">{success}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-left">Event ID:</label>
                    <input type="text" value={eventID} onChange={(e) => setEventID(e.target.value)} required 
                           className="w-full p-2 border rounded" />
                </div>
                <div>
                    <label className="block text-left">Buffet Time From:</label>
                    <input type="time" value={buffetTimeFrom} onChange={(e) => setBuffetTimeFrom(e.target.value)} 
                           className="w-full p-2 border rounded" />
                </div>
                <div>
                    <label className="block text-left">Buffet Time To:</label>
                    <input type="time" value={buffetTimeTo} onChange={(e) => setBuffetTimeTo(e.target.value)} 
                           className="w-full p-2 border rounded" />
                </div>
                <div>
                    <label className="block text-left">Additional Time:</label>
                    <input type="time" value={additionalTime} onChange={(e) => setAdditionalTime(e.target.value)} 
                           className="w-full p-2 border rounded" />
                </div>
                <div>
                    <label className="block text-left">Function Duration From:</label>
                    <input type="time" value={functionDurationFrom} onChange={(e) => setFunctionDurationFrom(e.target.value)} 
                           className="w-full p-2 border rounded" />
                </div>
                <div>
                    <label className="block text-left">Function Duration To:</label>
                    <input type="time" value={functionDurationTo} onChange={(e) => setFunctionDurationTo(e.target.value)} 
                           className="w-full p-2 border rounded" />
                </div>
                <div className="flex justify-between w-full mt-3">
                    <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EventForm;
