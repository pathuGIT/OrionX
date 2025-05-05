import React from 'react';

export const BookingTable = ({ bookings, onRowClick }) => {
    return (
        <table className="w-full border-collapse border border-gray-200">
            <thead>
                <tr>
                    <th className="border px-4 py-2">Booking ID</th>
                    <th className="border px-4 py-2">Date</th>
                    <th className="border px-4 py-2">Status</th>
                    <th className="border px-4 py-2">Customer ID</th>
                    <th className="border px-4 py-2">Total Price</th>
                </tr>
            </thead>
            <tbody>
                {bookings.map((booking) => (
                    <tr
                        key={booking.booking_id}
                        className={`cursor-pointer ${
                            booking.status === 'confirmed' &&
                            new Date(booking.booking_date) > new Date() &&
                            'bg-yellow-100'
                        }`}
                        onClick={() => onRowClick(booking.booking_id)}
                    >
                        <td className="border px-4 py-2">{booking.booking_id}</td>
                        <td className="border px-4 py-2">{booking.booking_date}</td>
                        <td className="border px-4 py-2">{booking.status}</td>
                        <td className="border px-4 py-2">{booking.customer_id}</td>
                        <td className="border px-4 py-2">{booking.total_price}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};
