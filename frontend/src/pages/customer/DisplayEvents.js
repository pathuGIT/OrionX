import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/Authcontext";
import { getPlannedEvents } from "../../services/EventService";
import { Calendar, Clock, Phone, User, CheckCircle, XCircle, PartyPopper, Heart, X } from "lucide-react";

const DisplayEvents = () => {
    const { user } = useContext(AuthContext);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);

    useEffect(() => {
        const customerID = sessionStorage.getItem("id");
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
            .catch((error) => {
                console.error("Error fetching events:", error);
                setError("Failed to load events. Please try again later.");
                setLoading(false);
            });
    }, [user]);

    const formatDateTime = (dateTimeString) => {
        if (!dateTimeString) return "N/A";

        if (/^\d{2}:\d{2}:\d{2}$/.test(dateTimeString)) {
            const today = new Date();
            const [hours, minutes, seconds] = dateTimeString.split(":");
            today.setHours(hours, minutes, seconds);
            return today.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
        }

        const date = new Date(dateTimeString);
        if (isNaN(date.getTime())) return "Invalid Date";

        return date.toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const EventModal = ({ event, onClose }) => {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-white">Event Details #{event.Event_ID}</h2>
                        <button onClick={onClose} className="text-white hover:text-gray-200">
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                    
                    <div className="p-6 space-y-6">
                        {/* Timeline Section */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-blue-600">
                                <Clock className="w-5 h-5" />
                                <h4 className="font-semibold">Event Timeline</h4>
                            </div>
                            <div className="space-y-2 pl-7 border-l-2 border-blue-100">
                                <div>
                                    <p className="text-sm text-gray-500">Function Duration</p>
                                    <p className="font-medium">
                                        {formatDateTime(event.Function_durationFrom)} - {" "}
                                        {formatDateTime(event.Function_durationTo)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Buffet Time</p>
                                    <p className="font-medium">
                                        {formatDateTime(event.Buffet_TimeFrom)} - {" "}
                                        {formatDateTime(event.Buffet_TimeTo)}
                                    </p>
                                </div>
                                {event.Tea_table_Time && (
                                    <div>
                                        <p className="text-sm text-gray-500">Tea Time</p>
                                        <p className="font-medium">
                                            {formatDateTime(event.Tea_table_Time)}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Wedding Details */}
                        {event.Groom_Name && (
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-pink-600">
                                    <Heart className="w-5 h-5" />
                                    <h4 className="font-semibold">Wedding Details</h4>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-500">Groom</p>
                                        <p className="font-medium flex items-center gap-2">
                                            <User className="w-4 h-4 text-gray-500" />
                                            {event.Groom_Name}
                                        </p>
                                        <p className="text-sm text-gray-600">{event.Groom_Contact_no}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-500">Bride</p>
                                        <p className="font-medium flex items-center gap-2">
                                            <User className="w-4 h-4 text-gray-500" />
                                            {event.Bride_Name}
                                        </p>
                                        <p className="text-sm text-gray-600">{event.Bride_Contact_no}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Poruwa Ceremony</p>
                                        <p className="font-medium">
                                            {formatDateTime(event.Poruwa_CeremonyFrom)} - {" "}
                                            {formatDateTime(event.Poruwa_CeremonyTo)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Registration</p>
                                        <p className="font-medium">
                                            {formatDateTime(event.Registration_Time)}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex items-center gap-2">
                                        {event.Fountain ? (
                                            <CheckCircle className="w-5 h-5 text-green-500" />
                                        ) : (
                                            <XCircle className="w-5 h-5 text-red-500" />
                                        )}
                                        <span className="text-sm">Fountain</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {event.ProsperityTable ? (
                                            <CheckCircle className="w-5 h-5 text-green-500" />
                                        ) : (
                                            <XCircle className="w-5 h-5 text-red-500" />
                                        )}
                                        <span className="text-sm">Prosperity Table</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Custom Event Details */}
                        {event.Custom_Event_Name && (
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-purple-600">
                                    <Calendar className="w-5 h-5" />
                                    <h4 className="font-semibold">{event.Custom_Event_Name}</h4>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <div>
                                            <p className="text-sm text-gray-500">Contact Person</p>
                                            <p className="font-medium">{event.ContactPersonName}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Contact Number</p>
                                            <p className="font-medium">{event.ContactPersonNumber}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Event Date</p>
                                            <p className="font-medium">
                                                {formatDateTime(event.Function_durationFrom)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Duration</p>
                                            <p className="font-medium">
                                                {formatDateTime(event.Function_durationTo)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    if (loading) return <div className="text-center p-8"><p className="text-xl text-gray-600">Loading events...</p></div>;
    if (error) return <div className="text-center p-8"><p className="text-red-600 text-xl">{error}</p></div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                My Planned Events
            </h2>

            {selectedEvent && <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />}

            {events.length === 0 ? (
                <div className="text-center py-12">
                    <PartyPopper className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                    <p className="text-xl text-gray-600">No events planned yet. Let's create something amazing!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map((event) => (
                        <div key={event.Event_ID} className="group relative bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
                            <button 
                                onClick={() => setSelectedEvent(event)}
                                className="absolute bottom-4 right-4 z-10 px-4 py-2 bg-blue-500 text-white rounded-full text-sm hover:bg-blue-600 transition-colors shadow-md flex items-center gap-2"
                            >
                                <span>More Info</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </button>

                            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-bold text-white">Event #{event.Event_ID}</h3>
                                    {event.Groom_Name && <Heart className="w-6 h-6 text-pink-200" />}
                                </div>
                            </div>

                            <div className="p-6 space-y-6">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-blue-600">
                                        <Clock className="w-5 h-5" />
                                        <h4 className="font-semibold">Event Timeline</h4>
                                    </div>
                                    <div className="space-y-2 pl-7 border-l-2 border-blue-100">
                                        <div>
                                            <p className="text-sm text-gray-500">Function Duration</p>
                                            <p className="font-medium">
                                                {formatDateTime(event.Function_durationFrom)} - {" "}
                                                {formatDateTime(event.Function_durationTo)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Buffet Time</p>
                                            <p className="font-medium">
                                                {formatDateTime(event.Buffet_TimeFrom)} - {" "}
                                                {formatDateTime(event.Buffet_TimeTo)}
                                            </p>
                                        </div>
                                        {event.Tea_table_Time && (
                                            <div>
                                                <p className="text-sm text-gray-500">Tea Time</p>
                                                <p className="font-medium">
                                                    {formatDateTime(event.Tea_table_Time)}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DisplayEvents;