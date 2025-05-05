import React, { useEffect, useState } from 'react';
import { getBookingDetails, getBookings, updateContract, updatePricing } from '../../services/BookngService';
import { StatusFilter } from '../../components/bookings/StatusFilter';
import { BookingTable } from '../../components/bookings/BookingTable';
import { BookingDetailModal } from '../../components/bookings/BookingDetailModal';
import BookingDetailsView from '../../components/bookings/BookingDetailsView';

const BookingsAnalyze = () => {
    const [status, setStatus] = useState('all');
    const [bookings, setBookings] = useState([]);
    const [selectedBooking, setSelectedBooking] = useState(null);

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

    const handleSaveDetails = (updatedDetails) => {
        if (updatedDetails.contract) {
            updateContract(selectedBooking.booking_id, updatedDetails.contract);
        }
        if (updatedDetails.pricing) {
            updatePricing(selectedBooking.booking_id, updatedDetails.pricing);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">Bookings</h1>
            <StatusFilter currentStatus={status} onChange={setStatus} />
            <BookingTable bookings={bookings} onRowClick={handleRowClick} />
            {selectedBooking && (
                // <BookingDetailModal
                //     details={selectedBooking}
                //     onClose={() => setSelectedBooking(null)}
                //     onSave={handleSaveDetails}
                // />
                <BookingDetailsView 
                    bookingId={selectedBooking.booking_id} 
                    onClose={() => setSelectedBooking(null)}
                />
            )}
        </div>
    );
};

export default BookingsAnalyze;
