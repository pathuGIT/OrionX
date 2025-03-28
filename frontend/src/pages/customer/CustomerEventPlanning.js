import React, { useState } from "react";
import WeddingForm from "../../components/WeddingForm.js";
import EventForm from "../../components/EventForm.js";

const CustomerEventPlanning = () => {
    const [eventType, setEventType] = useState("");

    const handleEventChange = (e) => {
        setEventType(e.target.value);
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-gray-100 rounded-lg shadow-md text-center">
            <h2 className="text-2xl font-bold mb-4">Plan Your Event</h2>
            
            <label className="block text-left font-semibold">Select Event Type:</label>
            <select value={eventType} onChange={handleEventChange} className="w-full p-2 border rounded mt-2">
                <option value="">-- Choose an Event --</option>
                <option value="wedding">Wedding</option>
                <option value="custom">Custom Event</option>
            </select>

            {/* Render the corresponding form based on selection */}
            <div className="mt-4">
                {eventType === "wedding" && <WeddingForm />}
                {eventType === "custom" && <CustomEventForm />}
            </div>
        </div>
    );
};

const CustomEventForm = () => {
    return (
        <div className="p-4 bg-white rounded shadow-md mt-4">
            <h3 className="text-xl font-semibold mb-2">Custom Event Planning</h3>
            <EventForm />
        </div>
    );
};


export default CustomerEventPlanning;
