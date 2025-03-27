import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/Authcontext"; // Import AuthContext

const CustomerBookings = () => {
    const { user } = useContext(AuthContext); // Get user from AuthContext
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let customerID = sessionStorage.getItem("id"); // Fetch from sessionStorage
        
        if (!customerID && user) {
            customerID = user.id; // If not found in sessionStorage, get from AuthContext
        }

        if (!customerID) {
            setError("Customer ID not found in session.");
            setLoading(false);
            return;
        }

        // Fetch customer bookings from backend
        axios.get(`http://localhost:8000/api/customer/${customerID}`)
            .then(response => {
                setBookings(response.data.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching bookings:", error);
                setError("Failed to load bookings.");
                setLoading(false);
            });

    }, [user]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div>
            <h2>My Bookings</h2>
            {bookings.length === 0 ? (
                <p>No bookings found.</p>
            ) : (
                <table border="1">
                    <thead>
                        <tr>
                            <th>Booking ID</th>
                            <th>Customer ID</th>
                            <th>Booking Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map((booking) => (
                            <tr key={booking.booking_id}>
                                <td>{booking.booking_id}</td>
                                <td>{booking.customer_id}</td>
                                <td>{booking.booking_date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default CustomerBookings;
