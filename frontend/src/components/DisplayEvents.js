import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/Authcontext";
//import { encryptCustId } from "../utills/encryptionUtils";
import { getPlannedEvents } from "../services/EventService";
import { Calendar, Clock, Phone, User, CheckCircle, XCircle } from "lucide-react";

const DisplayEvents = () => {
    const { user } = useContext(AuthContext);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);



    useEffect(() => {
        let customerID = sessionStorage.getItem("id");

        if (!customerID) {
            setError("Customer ID not found in session.");
            setLoading(false);
            return;
        }

        getPlannedEvents(customerID)
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
    const formatDateTime = (dateTimeString) => {
        if (!dateTimeString) return "N/A";

        // Check if the string contains only time (e.g., "08:27:00")
        if (/^\d{2}:\d{2}:\d{2}$/.test(dateTimeString)) {
            // Convert time-only values to a proper Date object (using today's date)
            const today = new Date();
            const [hours, minutes, seconds] = dateTimeString.split(":");
            today.setHours(parseInt(hours, 10), parseInt(minutes, 10), parseInt(seconds, 10), 0);

            return today.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            });
        }

        // If it's a full date-time string, format it normally
        const date = new Date(dateTimeString);
        if (isNaN(date.getTime())) return "Invalid Date"; // Handle invalid dates

        return date.toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });
    };


    if (loading) return <p className="text-center text-xl">Loading...</p>;
    if (error) return <p className="text-center text-red-600">{error}</p>;

    return (
        <div className="container mx-auto px-6 py-8">
            <h2 className="text-3xl font-bold text-center mb-8 text-blue-600">My Planned Events</h2>
            {events.length === 0 ? (
                <p className="text-center text-gray-600">No events found.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {events.map((event) => (
                        <div key={event.Event_ID} className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200 transform hover:scale-105 transition-all duration-300">
                            <div className="p-6">
                                <h3 className="text-2xl font-semibold text-blue-500 mb-2">Event ID: {event.Event_ID}</h3>

                                <div className="text-gray-700 space-y-3">
                                    <p className="flex items-center gap-2">
                                        <Clock className="w-5 h-5 text-gray-500" />
                                        Function Duration From: {formatDateTime(event.Function_durationFrom)}
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <Clock className="w-5 h-5 text-gray-500" />
                                        Function Duration To: {formatDateTime(event.Function_durationTo)}
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <Clock className="w-5 h-5 text-gray-500" />
                                        Buffet Time From : {formatDateTime(event.Buffet_TimeFrom)} - {formatDateTime(event.Buffet_TimeTo)}
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <Clock className="w-5 h-5 text-gray-500" />
                                        Buffet Time To : {formatDateTime(event.Buffet_TimeTo)}
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <Clock className="w-5 h-5 text-gray-500" />
                                        Tea Time: {formatDateTime(event.Tea_table_Time)}
                                    </p>
                                </div>

                                {/* Wedding Details */}
                                {event.Groom_Name && (
                                    <div className="mt-5 p-4 bg-gray-100 rounded-lg">
                                        <h4 className="text-xl font-bold text-blue-600">Wedding Details</h4>
                                        <p className="flex items-center gap-2"><User className="w-5 h-5 text-gray-500" />Groom: {event.Groom_Name}</p>
                                        <p className="flex items-center gap-2"><User className="w-5 h-5 text-gray-500" />Bride: {event.Bride_Name}</p>
                                        <p className="flex items-center gap-2"><Phone className="w-5 h-5 text-gray-500" />Groom Contact No : {event.Groom_Contact_no}</p>
                                        <p className="flex items-center gap-2"><Phone className="w-5 h-5 text-gray-500" />Bride Contact No: {event.Bride_Contact_no}</p>
                                        <p className="flex items-center gap-2"><Calendar className="w-5 h-5 text-gray-500" />Registration Time: {formatDateTime(event.Registration_Time)}</p>
                                        <p className="flex items-center gap-2"><Calendar className="w-5 h-5 text-gray-500" />Poruwa Ceremony From: {formatDateTime(event.Poruwa_CeremonyFrom)} </p>
                                        <p className="flex items-center gap-2"><Calendar className="w-5 h-5 text-gray-500" />Poruwa Ceremony To: {formatDateTime(event.Poruwa_CeremonyTo)} </p>
                                        <p className="flex items-center gap-2">
                                            {event.Fountain ? <CheckCircle className="w-5 h-5 text-green-500" /> : <XCircle className="w-5 h-5 text-red-500" />}
                                            Fountain: {event.Fountain ? "Yes" : "No"}
                                        </p>
                                        <p className="flex items-center gap-2">
                                            {event.ProsperityTable ? <CheckCircle className="w-5 h-5 text-green-500" /> : <XCircle className="w-5 h-5 text-red-500" />}
                                            Prosperity Table: {event.ProsperityTable ? "Yes" : "No"}
                                        </p>
                                    </div>
                                )}

                                {/* Custom Event Details */}
                                {event.Custom_Event_Name && (
                                    <div className="mt-5 p-4 bg-gray-100 rounded-lg">
                                        <h4 className="text-xl font-bold text-blue-600">{event.Custom_Event_Name} Details</h4>
                                        <p className="flex items-center gap-2"><User className="w-5 h-5 text-gray-500" /></p>
                                        <p className="flex items-center gap-2"><User className="w-5 h-5 text-gray-500" />Contact Person: {event.ContactPersonName}</p>
                                        <p className="flex items-center gap-2"><Phone className="w-5 h-5 text-gray-500" />Contact Number: {event.ContactPersonNumber}</p>
                                        <p className="flex items-center gap-2"><Calendar className="w-5 h-5 text-gray-500" />Event Date: {formatDateTime(event.Event_Date)}</p>
                                        <p className="flex items-center gap-2"><Calendar className="w-5 h-5 text-gray-500" />Event Time: {formatDateTime(event.Event_Time)}</p>
                                        <p className="flex items-center gap-2"><Calendar className="w-5 h-5 text-gray-500" />Event Duration: {formatDateTime(event.Event_Duration)}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};


export default DisplayEvents;