import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Reusable detail row
function DetailRow({ label, value }) {
  return (
    <div className="flex flex-col p-2">
      <span className="text-gray-500 text-sm">{label}</span>
      <span className="text-gray-800 font-medium">{value || '-'}</span>
    </div>
  );
}

// Main component to fetch and display booking details
export default function BookingDetailsView({ bookingId, onClose }) {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchBooking() {
      try {
        const res = await axios.get(`http://localhost:8000/api/booking/${bookingId}`);
        setBooking(res.data.data);
      } catch (err) {
        setError('Failed to load booking details');
      } finally {
        setLoading(false);
      }
    }
    fetchBooking();
  }, [bookingId]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  const b = booking;
  // Format ISO dates to readable
  const formatDate = (iso) => new Date(iso).toLocaleDateString();

  return (
    // <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md space-y-6">
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white rounded-lg p-6 w-3/4">
      {/* Booking Information */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Booking Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <DetailRow label="Booking ID" value={b.booking_id} />
          <DetailRow label="Date" value={formatDate(b.booking_date)} />
          <DetailRow label="Time Slot" value={b.time_slot} />
          <DetailRow label="Status" value={b.status} />
          <DetailRow label="Venue ID" value={b.venue_id} />
          <DetailRow label="Customer ID" value={b.customer_id} />
          <DetailRow label="Guests" value={b.number_of_guests} />
          <DetailRow label="Additional Hours" value={b.additional_hours} />
        </div>
      </section>

      {/* Contract Information */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contract Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <DetailRow label="Contract ID" value={b.contract_id} />
          <DetailRow label="Deposit Amount (Rs)" value={b.deposit_amount} />
          <DetailRow label="Damage Fee (Rs)" value={b.damage_fee} />
          <DetailRow label="Refund Amount (Rs)" value={b.refund_amount} />
          <DetailRow label="Contract Status" value={b.contract_status} />
        </div>
      </section>

      {/* Pricing Information */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Pricing Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <DetailRow label="Menu Price Total (Rs)" value={b.menu_price_total} />
          <DetailRow label="Hall Charge (Rs)" value={b.hall_charge} />
          <DetailRow label="Extra Hour Fee (Rs)" value={b.extra_hour_fee} />
          <DetailRow label="Bites Payment (Rs)" value={b.bites_payment} />
          <DetailRow label="Fountain Payment (Rs)" value={b.fountain_payment} />
          <DetailRow label="Other Payment (Rs)" value={b.other_payment} />
          <DetailRow label="Overall Total (Rs)" value={b.overall_total} />
          <DetailRow label="Forfeited Deposit (Rs)" value={b.forfeited_deposit} />
        </div>
      </section>
        <div className="flex justify-end mt-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 rounded-lg mr-2"
                    >
                        Cancel
                    </button>
                </div>
        </div>
    </div>
  );
}
