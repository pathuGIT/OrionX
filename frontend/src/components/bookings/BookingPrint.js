import React, { useEffect, useState } from 'react';
import { getPrintBookingDetails } from '../../services/BookngService';
import { useParams } from 'react-router-dom';
import { FiX } from 'react-icons/fi';

const BookingPrint = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getPrintBookingDetails(id)
      .then(res => {
        if (res.success) {
          setBooking(res.data);
        } else {
          setError('Failed to fetch booking details');
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch booking details');
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!booking) return null;

  return (
    <div className="w-screen min-h-screen bg-white p-10 print:p-0">
      <div className="max-w-4xl mx-auto border border-gray-200 p-8 rounded-lg shadow-lg print:shadow-none print:border-0 print:max-w-full">
        {/* Print Header */}
        <div className="print:hidden flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Booking Invoice</h1>
          <button 
            onClick={() => window.print()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Print Invoice
          </button>
        </div>

        {/* Invoice Content */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-lg font-semibold border-b pb-2 mb-2">Customer Details</h2>
              <div className="space-y-1">
                <p><span className="font-medium">Name:</span> {booking.name}</p>
                <p><span className="font-medium">Email:</span> {booking.email}</p>
                <p><span className="font-medium">Phone:</span> {booking.phone}</p>
                <p><span className="font-medium">Address:</span> {booking.address}</p>
                <p><span className="font-medium">Customer ID:</span> {booking.customer_id}</p>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold border-b pb-2 mb-2">Booking Details</h2>
              <div className="space-y-1">
                <p><span className="font-medium">Booking ID:</span> {booking.booking_id}</p>
                <p><span className="font-medium">Status:</span> {booking.b_status}</p>
                <p><span className="font-medium">Date:</span> {new Date(booking.booking_date).toLocaleDateString()}</p>
                <p><span className="font-medium">Time Slot:</span> {booking.b_time_slot}</p>
                <p><span className="font-medium">Guests:</span> {booking.b_number_of_guests}</p>
                <p><span className="font-medium">Additional Hours:</span> {booking.b_additional_hours}</p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-semibold border-b pb-2 mb-2">Venue Details</h2>
            <div className="space-y-1">
              <p><span className="font-medium">Venue:</span> {booking.venue_name} ({booking.venue_id})</p>
              <p><span className="font-medium">Location:</span> {booking.Location}</p>
              <p><span className="font-medium">Capacity:</span> {booking.min_capacity} - {booking.max_capacity}</p>
              <p><span className="font-medium">Opened Time Period:</span> {booking.opened_time_period} hours</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-semibold border-b pb-2 mb-2">Charges</h2>
            <table className="w-full">
              <tbody>
                {[
                  ['Hall Charge', booking.hall_charge],
                  ['Menu Price Total', booking.menu_price_total],
                  ['Extra Hour Fee', booking.extra_hour_fee],
                  ['Bites Payment', booking.bites_payment],
                  ['Fountain Payment', booking.fountain_payment],
                  ['Other Payment', booking.other_payment],
                  ['Deposit Amount', booking.deposit_amount],
                  ['Damage Fee', booking.damage_fee],
                  ['Refund Amount', booking.refund_amount],
                  ['Forfeited Deposit', booking.forfeited_deposit],
                ].map(([label, value], index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2">{label}</td>
                    <td className="py-2 text-right">{Number(value).toLocaleString()}</td>
                  </tr>
                ))}
                <tr className="border-t-2 border-black font-bold">
                  <td className="py-2">Overall Total</td>
                  <td className="py-2 text-right">{Number(booking.overall_total).toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div>
            <h2 className="text-lg font-semibold border-b pb-2 mb-2">Contract Status</h2>
            <p>{booking.contract_status}</p>
          </div>
        </div>

        {/* Print-only footer */}
        <div className="hidden print:block mt-16 pt-4 border-t text-sm text-center text-gray-500">
          Generated on {new Date().toLocaleDateString()} | Booking ID: {booking.booking_id}
        </div>
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          body, html {
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          body > *:not(#root) {
            display: none !important;
          }
          #root > *:not(.print-content) {
            display: none !important;
          }
          .print-content {
            display: block !important;
            width: 100% !important;
            min-height: 100vh !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .print\:shadow-none {
            box-shadow: none !important;
          }
          .print\:border-0 {
            border: 0 !important;
          }
          .print\:max-w-full {
            max-width: 100% !important;
          }
          .print\:p-0 {
            padding: 0 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default BookingPrint;