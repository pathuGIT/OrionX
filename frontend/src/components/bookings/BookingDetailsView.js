import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getBookingDetails } from '../../services/BookngService';

// Reusable detail row
function DetailRow({ label, value }) {
    if (label === "Venue ID") return (
        <div className="flex flex-col ">
            <span className="text-gray-500 text-sm">{label}</span>
            <span className="text-gray-800 text-sm font-medium">{value || '-'}</span>
        </div>
    );

    if (label !== "Venue ID") return (
        <div className="flex flex-col ">
            <span className="text-gray-500 text-sm">{label}</span>
            <span className="text-gray-800 text-sm font-medium">{value || '-'}</span>
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
                const res = await getBookingDetails(bookingId)

                // Wait 3 seconds before setting booking and loading
                setTimeout(() => {
                    setBooking(res.data);
                    setLoading(false);
                }, 3000);
            } catch (err) {
                setError('Failed to load booking details');
                setLoading(false);
            }
        }
        fetchBooking();
    }, [bookingId]);

    //if (loading) return <div className="p-6">Loading...</div>;
    if (error) return <div className="p-6 text-red-600">{error}</div>;

    const b = booking;
    // Format ISO dates to readable
    const formatDate = (iso) => new Date(iso).toLocaleDateString();

    return (
        <div style={{ maxWidth: '1130px' }} className=" fixed left-60 right-0 top-10 bg-black bg-opacity-10 py-10 flex justify-center m-16 overflow-y-auto z-50">
            <div className="flex flex-col bg-white rounded-lg p-6 w-3/4">
                {/* Booking Information */}
                {(loading ? <div className='flex flex-row justify-center gap gap-5 border'>
                    {/* Loading... */}

                    <div role="status" class="max-w-md p-4 space-y-4 border border-gray-200 divide-y divide-gray-200 rounded-sm shadow-sm animate-pulse dark:divide-gray-700 md:p-6 dark:border-gray-700">
                        <div class="flex items-center justify-between">
                            <div>
                                <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                                <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                            </div>
                            <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
                        </div>
                        <div class="flex items-center justify-between pt-4">
                            <div>
                                <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                                <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                            </div>
                            <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
                        </div>
                        <div class="flex items-center justify-between pt-4">
                            <div>
                                <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                                <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                            </div>
                            <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
                        </div>
                        <div class="flex items-center justify-between pt-4">
                            <div>
                                <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                                <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                            </div>
                            <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
                        </div>
                        <div class="flex items-center justify-between pt-4">
                            <div>
                                <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                                <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                            </div>
                            <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
                        </div>
                        <span class="sr-only">Loading...</span>
                    </div>
                </div>

                : <div className='flex flex-row justify-center gap gap-5 border'>
                    <div className='flex flex-col'>
                        <section>
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Booking Information</h2>
                            <div className="border grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                        <section className='mt-5 border'>
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Contract Information</h2>
                            <div className="border grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <DetailRow label="Contract ID" value={b.contract_id} />
                                <DetailRow label="Deposit Amount (Rs)" value={b.deposit_amount} />
                                <DetailRow label="Damage Fee (Rs)" value={b.damage_fee} />
                                <DetailRow label="Refund Amount (Rs)" value={b.refund_amount} />
                                <DetailRow label="Contract Status" value={b.contract_status} />
                            </div>
                        </section>
                    </div>


                    {/* Pricing Information */}
                    <section>
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Pricing Information</h2>
                        <div className="border grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                </div>)}
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
