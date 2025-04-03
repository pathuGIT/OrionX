import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/Authcontext";
import { getCustomerBookings } from "../services/EventService";
import { useNavigate } from "react-router-dom";
import { encryptBookingId,encryptCustId } from "../utills/encryptionUtils";    


const CustomerBookings = () => {
    const { user } = useContext(AuthContext);
    const [bookings, setBookings] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

//take this part
    useEffect(() => {
        let customerID = sessionStorage.getItem("id");

        if (!customerID && user) {
            customerID = user.id;
        }

        if (!customerID) {
            setError("Customer ID not found in session.");
            setLoading(false);
            return;
        }

        // Fetch customer bookings using the API function
        getCustomerBookings(customerID)
            .then(data => {
                setBookings(data);
                setLoading(false);
            })
            .catch(error => {
                setError("Failed to load bookings.");
                setLoading(false);
            });

    }, [user]);
//here 

// {/* <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all duration-300"
// onClick={() =>{
// const encryptedId = encryptBookingId(booking.booking_id);
// navigate(`/profile/${encryptedId}`)}}>
// Plan your Event</button> */}

//under construction


    // Function to format date
    const formatDate = (isoDate) => {
        const date = new Date(isoDate);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };


    if (loading) return <p className="text-center text-xl">Loading...</p>;
    if (error) return <p className="text-center text-red-600">{error}</p>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold text-center mb-6">My Bookings</h2>
            {bookings.length === 0 ? (
                <p className="text-center">No bookings found.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bookings.map((booking) => (
                        <div key={booking.booking_id} className="bg-white shadow-lg rounded-lg overflow-hidden transform hover:scale-105 transition-all duration-300">
                            <div className="p-6">
                                <h3 className="text-2xl font-semibold text-blue-500">Booking ID: {booking.booking_id}</h3>
                                <p className="text-lg text-gray-600 mt-2">Customer ID: {booking.customer_id}</p>
                                <p className="text-lg text-gray-600 mt-2">Booking Date: {formatDate(booking.booking_date)}</p>
                            </div>
                            <div className="p-4 bg-gray-100 text-center">
                                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all duration-300"
                                onClick={() => {
                                    const encryptedId = encryptBookingId(booking.booking_id);
                                    const encryptedCustomerId = encryptCustId(booking.customer_id);
                                    navigate(`/eventHome/${encryptedId}/${encryptedCustomerId}`);
                                    
                                }}>
                                Plan your Event</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CustomerBookings;
