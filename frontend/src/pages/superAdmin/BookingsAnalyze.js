import React, { useEffect, useState } from 'react';
import { getBookingDetails, getBookings, updateContract } from '../../services/BookngService';
import { StatusFilter } from '../../components/bookings/StatusFilter';
import { BookingTable } from '../../components/bookings/BookingTable';
import BookingDetailsView from '../../components/bookings/BookingDetailsView';

const BookingsAnalyze = () => {
    const [status, setStatus] = useState('all');
    const [bookings, setBookings] = useState([]);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [serchBy, setSerchBy] = useState("");

    useEffect(() => {
        fetchBookings();
    }, [status]);

    // Fetch bookings data called inside useEffect
    const fetchBookings = async () => {
        const data = await getBookings(status);
        setBookings(data.data);
    };

    const handleRowClick = (id) => {
        getBookingDetails(id).then((data) => setSelectedBooking(data.data));
    };

    

    return (
        <div className="p-6">
            <StatusFilter currentStatus={status} onChange={setStatus} onSearch={setSerchBy} serchBy={serchBy}/>
            <BookingTable bookings={bookings} onRowClick={handleRowClick} />
            {selectedBooking && (
                <BookingDetailsView 
                    bookingId={selectedBooking.booking_id} 
                    onClose={() => setSelectedBooking(null)}
                />
            )}
        </div>
    );
};

export default BookingsAnalyze;
