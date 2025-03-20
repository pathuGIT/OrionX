// src/components/EventForm.js
import React, { useState } from 'react';
import axios from 'axios';

const EventForm = () => {
    const [eventType, setEventType] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [pax, setPax] = useState('');
    const [menu, setMenu] = useState('');
    const [contactPersonName, setContactPersonName] = useState('');
    const [contactPersonNumber, setContactPersonNumber] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const eventData = {
            eventType,
            eventDate,
            pax: parseInt(pax),
            menu,
            contactPersonName,
            contactPersonNumber,
        };

        try {
            const response = await axios.post('http://localhost:8000/api/events', eventData);
            setSuccess(response.data.message);
            // Reset form fields
            setEventType('');
            setEventDate('');
            setPax('');
            setMenu('');
            setContactPersonName('');
            setContactPersonNumber('');
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred while creating the event.');
        }
    };

    return (
        <div>
            <h2>Create Event</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Event Type:</label>
                    <input
                        type="text"
                        value={eventType}
                        onChange={(e) => setEventType(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Event Date:</label>
                    <input
                        type="date"
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Number of Guests (Pax):</label>
                    <input
                        type="number"
                        value={pax}
                        onChange={(e) => setPax(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Menu:</label>
                    <input
                        type="text"
                        value={menu}
                        onChange={(e) => setMenu(e.target.value)}
                    />
                </div>
                <div>
                    <label>Contact Person Name:</label>
                    <input
                        type="text"
                        value={contactPersonName}
                        onChange={(e) => setContactPersonName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Contact Person Number:</label>
                    <input
                        type="text"
                        value={contactPersonNumber}
                        onChange={(e) => setContactPersonNumber(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Create Event</button>
            </form>
        </div>
    );
};

export default EventForm;