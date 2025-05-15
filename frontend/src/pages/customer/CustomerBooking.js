import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/Authcontext";
import { getCustomerBookings } from "../../services/EventService";
import { useNavigate } from "react-router-dom";
import { encryptBookingId, encryptCustId } from "../../utills/encryptionUtils";
import { Calendar, User, ArrowRight, Loader2, AlertCircle } from "lucide-react";

const CustomerBookings = () => {
    const { user } = useContext(AuthContext);
    const [bookings, setBookings] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let customerID = sessionStorage.getItem("id");
        if (!customerID && user) customerID = user.id;

        if (!customerID) {
            setError("Customer ID not found in session.");
            setLoading(false);
            return;
        }

        getCustomerBookings(customerID)
            .then(data => {
                setBookings(data);
                setLoading(false);
            })
            .catch(error => {
                setError("Failed to load bookings. Please try again.");
                setLoading(false);
            });
    }, [user]);

    const formatDate = (isoDate) => {
        const date = new Date(isoDate);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
        </div>
    );

    if (error) return (
        <div className="flex flex-col items-center justify-center h-64 text-red-500">
            <AlertCircle className="w-12 h-12 mb-4" />
            <p className="text-xl font-medium">{error}</p>
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                My Bookings
            </h2>
            
            {bookings.length === 0 ? (
                <div className="text-center py-12">
                    <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-xl text-gray-600">No bookings found. Start by creating a new booking!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bookings.map((booking) => (
                        <div key={booking.booking_id} className="group relative bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
                            <div className="p-6 space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="bg-blue-100 p-2 rounded-full">
                                        <Calendar className="w-6 h-6 text-blue-500" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-800">Booking #{booking.booking_id}</h3>
                                </div>

                                <div className="space-y-2 pl-2">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <User className="w-5 h-5 text-gray-400" />
                                        <span>Customer ID: {booking.customer_id}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Calendar className="w-5 h-5 text-gray-400" />
                                        <span>{formatDate(booking.booking_date)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t p-4 bg-gray-50">
                                <button 
                                    onClick={() => {
                                        localStorage.setItem('bookingId', booking.booking_id); //save booking id on local
                                        const encryptedId = encryptBookingId(booking.booking_id);
                                        const encryptedCustomerId = encryptCustId(booking.customer_id);
                                        navigate(`/eventHome/${encryptedId}/${encryptedCustomerId}`);
                                    }}
                                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
                                >
                                    Plan Your Event
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl blur-lg filter opacity-20"></div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CustomerBookings;