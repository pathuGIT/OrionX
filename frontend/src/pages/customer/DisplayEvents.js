import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/Authcontext";
import { getPlannedEvents } from "../../services/EventService";
import { useParams } from "react-router-dom";
import { Calendar, Clock, User, CheckCircle, XCircle, PartyPopper, Heart, X } from "lucide-react";
import { decryptBookingId } from "../../utills/encryptionUtils.js";

/**
 * A component to display the details of a specific planned event based on
 * the encrypted booking ID from the URL and the customer ID from the session.
 */
const DisplayEvents = () => {
    const { user } = useContext(AuthContext);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);

    // Get the encrypted bookingId from the URL parameters
    const { bookingId } = useParams();

    useEffect(() => {
        // This function encapsulates the entire data fetching process
        const fetchEventForBooking = () => {
            // 1. Get Customer ID from session storage
            const customerID = sessionStorage.getItem("id");
            if (!customerID) {
                setError("Your session has expired. Please log in again.");
                setLoading(false);
                return;
            }

            // 2. Decrypt the Booking ID from the URL
            let decryptedBookingId = null;
            try {
                if (!bookingId) {
                    throw new Error("Booking ID is missing from the URL.");
                }
                decryptedBookingId = decryptBookingId(bookingId);
            } catch (err) {
                console.error("Decryption Error:", err);
                setError("The event link is invalid or has expired.");
                setLoading(false);
                return;
            }

            // 3. Ensure decryption was successful before proceeding
            if (!decryptedBookingId) {
                setError("Could not verify the event identifier.");
                setLoading(false);
                return;
            }

            // 4. Fetch the event data using BOTH the customer ID and the decrypted booking ID
            getPlannedEvents(customerID, decryptedBookingId)
                .then(data => {
                    // The backend should return an array, even if it's just one event
                    setEvents(data);
                })
                .catch((error) => {
                    console.error("Error fetching event details:", error);
                    setError("Could not load the event details. The event may not exist or you may not have permission to view it.");
                })
                .finally(() => {
                    // This will run after the .then() or .catch() completes
                    setLoading(false);
                });
        };

        fetchEventForBooking();
    }, [bookingId, user]); // Re-run the effect if the bookingId or user changes

    /**
     * Formats a date or time string into a more readable format.
     * @param {string} dateTimeString - The date or time string to format.
     * @returns {string} The formatted date or time.
     */
    const formatDateTime = (dateTimeString) => {
        if (!dateTimeString) return "N/A";

        // Handle TIME format (HH:MM:SS)
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

        // Handle DATETIME format
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

    /**
     * A modal component to show detailed information about a selected event.
     */
    const EventModal = ({ event, onClose }) => {
        if (!event) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 flex justify-between items-center sticky top-0">
                        <h2 className="text-xl font-bold text-white">Event Details #{event.Event_ID}</h2>
                        <button onClick={onClose} className="text-white hover:text-gray-200 transition-opacity">
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
                            <div className="space-y-3 pl-7 border-l-2 border-blue-100">
                                <div>
                                    <p className="text-sm text-gray-500">Function Duration</p>
                                    <p className="font-medium">{formatDateTime(event.Function_durationFrom)} - {formatDateTime(event.Function_durationTo)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Buffet Time</p>
                                    <p className="font-medium">{formatDateTime(event.Buffet_TimeFrom)} - {formatDateTime(event.Buffet_TimeTo)}</p>
                                </div>
                                {event.Tea_table_Time && (
                                    <div>
                                        <p className="text-sm text-gray-500">Tea Time</p>
                                        <p className="font-medium">{formatDateTime(event.Tea_table_Time)}</p>
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
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pl-7 border-l-2 border-pink-100">
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-500">Groom</p>
                                        <p className="font-medium flex items-center gap-2"><User className="w-4 h-4 text-gray-500" />{event.Groom_Name}</p>
                                        <p className="text-sm text-gray-600">{event.Groom_Contact_no}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-500">Bride</p>
                                        <p className="font-medium flex items-center gap-2"><User className="w-4 h-4 text-gray-500" />{event.Bride_Name}</p>
                                        <p className="text-sm text-gray-600">{event.Bride_Contact_no}</p>
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
                                <div className="pl-7 border-l-2 border-purple-100">
                                    <p className="text-sm text-gray-500">Contact Person</p>
                                    <p className="font-medium">{event.ContactPersonName} ({event.ContactPersonNumber})</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return <div className="text-center p-8"><p className="text-xl text-gray-600">Loading Event Details...</p></div>;
    }

    if (error) {
        return <div className="text-center p-8"><p className="text-red-600 text-xl">{error}</p></div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                My Planned Event
            </h2>

            {selectedEvent && <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />}

            {events.length === 0 ? (
                <div className="text-center py-12">
                    <PartyPopper className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                    <p className="text-xl text-gray-600">No event details were found for this booking.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {events.map((event) => (
                        <div key={event.Event_ID} className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-bold text-gray-800">Event #{event.Event_ID}</h3>
                                    {event.Groom_Name ? 
                                        <Heart className="w-6 h-6 text-pink-400" /> : 
                                        <PartyPopper className="w-6 h-6 text-yellow-500" />
                                    }
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <Clock className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                                        <div>
                                            <p className="text-sm text-gray-500">Function Time</p>
                                            <p className="font-medium text-sm">{formatDateTime(event.Function_durationFrom)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Calendar className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                                        <div>
                                            <p className="text-sm text-gray-500">Event Type</p>
                                            <p className="font-medium text-sm">{event.Groom_Name ? "Wedding" : event.Custom_Event_Name || "Custom Event"}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-6 text-center">
                                     <button 
                                        onClick={() => setSelectedEvent(event)}
                                        className="px-6 py-2 bg-blue-500 text-white rounded-full text-sm font-semibold hover:bg-blue-600 transition-colors shadow-md"
                                    >
                                        View Full Details
                                    </button>
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
