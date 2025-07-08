import React, { useEffect, useState } from 'react';
import { getPrintBookingDetails } from '../../services/BookngService';


const formatDate = (isoString) => {
  if (!isoString) return '-';
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

const formatCurrency = (value) => {
  if (value === null || value === undefined) return '0.00';
  const num = parseFloat(value);
  return isNaN(num) ? value : num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

export default function BookingPrintView({ bookingId, onBack }) {
  const [printData, setPrintData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPrintData() {
      try {
        setLoading(true);
        const res = await getPrintBookingDetails(bookingId);
        setPrintData(res.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load print data');
        setLoading(false);
      }
    }
    fetchPrintData();
  }, [bookingId]);

  if (loading) return <div className="p-6 text-center">Loading print data...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!printData) return <div className="p-6">No data available</div>;

  const { 
    booking_id, booking_date, b_time_slot, b_status, 
    venue_name, venue_id, Location, min_capacity, max_capacity,
    name, email, address, phone, customer_id,
    deposit_amount, damage_fee, refund_amount, contract_status,
    b_total_price, b_number_of_guests, b_additional_hours,
    menu_price_total, hall_charge, extra_hour_fee, 
    bites_payment, fountain_payment, other_payment,
    overall_total, forfeited_deposit
  } = printData;

  return (
    <div className="p-6 bg-white">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Booking Summary</h1>
          <p className="text-gray-600">Booking ID: {booking_id}</p>
          <p className="text-gray-500 text-sm">System Generated Document</p>
        </div>

        {/* Information Sections */}
        <div className="space-y-6">
          {/* Booking Info */}
          <div className="border-b pb-4">
            <h2 className="text-lg font-semibold mb-3">Booking Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-500">Booking Date</span>
                <p className="font-medium">{formatDate(booking_date)}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Time Slot</span>
                <p className="font-medium">{b_time_slot}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Status</span>
                <p className="font-medium">{b_status}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Total Price</span>
                <p className="font-medium">Rs. {formatCurrency(b_total_price)}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Number of Guests</span>
                <p className="font-medium">{b_number_of_guests}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Additional Hours</span>
                <p className="font-medium">{b_additional_hours}</p>
              </div>
            </div>
          </div>

          {/* Venue Info */}
          <div className="border-b pb-4">
            <h2 className="text-lg font-semibold mb-3">Venue Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-500">Venue ID</span>
                <p className="font-medium">{venue_id}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Venue Name</span>
                <p className="font-medium">{venue_name}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Location</span>
                <p className="font-medium">{Location}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Capacity</span>
                <p className="font-medium">{min_capacity} - {max_capacity} guests</p>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="border-b pb-4">
            <h2 className="text-lg font-semibold mb-3">Customer Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-500">Customer ID</span>
                <p className="font-medium">{customer_id}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Name</span>
                <p className="font-medium">{name}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Email</span>
                <p className="font-medium">{email}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Phone</span>
                <p className="font-medium">{phone}</p>
              </div>
              <div className="md:col-span-2">
                <span className="text-sm text-gray-500">Address</span>
                <p className="font-medium">{address}</p>
              </div>
            </div>
          </div>

          {/* Contract Info */}
          <div className="border-b pb-4">
            <h2 className="text-lg font-semibold mb-3">Contract Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-500">Deposit Amount</span>
                <p className="font-medium">Rs. {formatCurrency(deposit_amount)}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Damage Fee</span>
                <p className="font-medium">Rs. {formatCurrency(damage_fee)}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Refund Amount</span>
                <p className="font-medium">Rs. {formatCurrency(refund_amount)}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Contract Status</span>
                <p className="font-medium">{contract_status}</p>
              </div>
            </div>
          </div>

          {/* Pricing Info */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Pricing Breakdown</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-500">Menu Price Total</span>
                <p className="font-medium">Rs. {formatCurrency(menu_price_total)}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Hall Charge</span>
                <p className="font-medium">Rs. {formatCurrency(hall_charge)}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Extra Hour Fee</span>
                <p className="font-medium">Rs. {formatCurrency(extra_hour_fee)}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Bites Payment</span>
                <p className="font-medium">Rs. {formatCurrency(bites_payment)}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Liquor Price</span>
                <p className="font-medium">Rs. {formatCurrency(fountain_payment)}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Other Payment</span>
                <p className="font-medium">Rs. {formatCurrency(other_payment)}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Overall Total</span>
                <p className="font-medium">Rs. {formatCurrency(overall_total)}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Forfeited Deposit</span>
                <p className="font-medium">Rs. {formatCurrency(forfeited_deposit)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center text-sm text-gray-500 border-t pt-4">
          This is a system generated document for administrative purposes.
        </div>
      </div>
    </div>
  );
}