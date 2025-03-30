import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/Authcontext";
import { useNavigate } from "react-router-dom";
//import { encryptCustId } from "../utills/encryptionUtils";
import { getPlannedEvent } from "../services/EventService";

const DisplayEvents = () => {
    const { user } = useContext(AuthContext);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        let customerID = sessionStorage.getItem("id");

        if (!customerID) {
            setError("Customer ID not found in session.");
            setLoading(false);
            return;
        }

        getPlannedEvent(customerID)
            .then(data => {
                setEvents(data);
                setLoading(false);
            })
            .catch(() => {
                setError("Failed to load events.");
                setLoading(false);
            });

    }, [user]);

    // Function to format date and time
    const formatDateTime = (isoString) => {
        if (!isoString) return "N/A";
        const date = new Date(isoString);
        return date.toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) return <p className="text-center text-xl">Loading...</p>;
    if (error) return <p className="text-center text-red-600">{error}</p>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold text-center mb-6">My Planned Events</h2>
            {events.length === 0 ? (
                <p className="text-center">No events found.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map((event) => (
                        <div key={event.Event_ID} className="bg-white shadow-lg rounded-lg overflow-hidden transform hover:scale-105 transition-all duration-300">
                            <div className="p-6">
                                <h3 className="text-2xl font-semibold text-blue-500">Event ID: {event.Event_ID}</h3>
                                <p className="text-lg text-gray-600 mt-2">Buffet Time: {formatDateTime(event.Buffet_TimeFrom)} - {formatDateTime(event.Buffet_TimeTo)}</p>
                                <p className="text-lg text-gray-600 mt-2">Function Duration: {formatDateTime(event.Function_durationFrom)} - {formatDateTime(event.Function_durationTo)}</p>
                                <p className="text-lg text-gray-600 mt-2">Tea Table Time: {formatDateTime(event.Tea_table_Time)}</p>

                                {/* Wedding Details */}
                                {event.Groom_Name && (
                                    <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                                        <h4 className="text-xl font-bold text-blue-600">Wedding Details</h4>
                                        <p className="text-gray-700">Bride: {event.Bride_Name}</p>
                                        <p className="text-gray-700">Groom: {event.Groom_Name}</p>
                                        <p className="text-gray-700">Bride Contact: {event.Bride_Contact_no}</p>
                                        <p className="text-gray-700">Groom Contact: {event.Groom_Contact_no}</p>
                                        <p className="text-gray-700">Poruwa Ceremony: {formatDateTime(event.Poruwa_CeremonyFrom)} - {formatDateTime(event.Poruwa_CeremonyTo)}</p>
                                        <p className="text-gray-700">Registration Time: {formatDateTime(event.Registration_Time)}</p>
                                        <p className="text-gray-700">Fountain: {event.Fountain ? "Yes" : "No"}</p>
                                        <p className="text-gray-700">Prosperity Table: {event.ProsperityTable ? "Yes" : "No"}</p>
                                    </div>
                                )}

                                {/* Custom Event Details */}
                                {event.Custom_Event_Name && (
                                    <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                                        <h4 className="text-xl font-bold text-blue-600">Custom Event Details</h4>
                                        <p className="text-gray-700">Event Name: {event.Custom_Event_Name}</p>
                                        <p className="text-gray-700">Contact Person: {event.ContactPersonName}</p>
                                        <p className="text-gray-700">Contact Number: {event.ContactPersonNumber}</p>
                                    </div>
                                )}
                            </div>
                            <div className="p-4 bg-gray-100 text-center">
                                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all duration-300"
                                    onClick={() => {
                                        
                                        navigate(`/display-events`);
                                    }}>
                                    View Event Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DisplayEvents;
