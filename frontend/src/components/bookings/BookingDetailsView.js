import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BookingService, { getBookingDetails, updateAdditionalHours, updateBookingGuest, updateBookingStatus, updateBookingVenue, updateDamageFee } from '../../services/BookngService';
import VenueDropdown from './VenueDropdown';
import { getAllVenues, getVenueById } from '../../services/VenueService';

// Reusable detail row
function DetailRow({ label, value, bookingId, onVenueUpdated, setRefresh, refresh, setCanselbtn }) {
    const [edit, setEdit] = useState(false);
    const [venues, setVenues] = useState([]);
    const [selectedVenue, setSelectedVenue] = useState(value);
    const [saving, setSaving] = useState(false);
    const [textBuffer, setTextBuffer] = useState(value);

    useEffect(() => {
        if (label === "Venue ID") {
            getAllVenues().then((data) => setVenues(data));
        }
        if (label === "Status") {
            setVenues([{
                'venue_id': 1,
                'venue_name': "pending"
            }, {
                'venue_id': 2,
                'venue_name': "confirmed"
            }, {
                'venue_id': 3,
                'venue_name': "cancelled"
            }]);
        }

    }, [label]);


    if (label === "Venue ID" || label === "Status" || label === "Damage Fee (Rs)" || label === "Guests" || label === "Additional Hours") return (
        <div className="flex flex-col border relative group">
            {/* Display label and value when not editing */}
            {!edit && (
                <>
                    <span className="text-gray-500 text-sm">{label}</span>
                    <span className="text-gray-800 text-sm font-medium">{value}</span>
                    <button
                        className="absolute top-2 right-2 px-2 py-1 text-xs  text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Edit Venue"
                        onClick={() => {setEdit(true); setCanselbtn(true)}}
                    >
                        <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z" />
                        </svg>

                    </button>
                </>
            )}
            {/* Editing mode: show dropdown and confirm button */}
            {edit && (
                <div className="flex flex-col gap-2">
                    <span className="text-gray-500 text-sm">{label}</span>

                    {(label === "Venue ID" || label === "Status") && (
                        <select className="border rounded p-1" value={selectedVenue} onChange={e => setSelectedVenue(e.target.value)}>
                            <option value="">Select Venue</option>
                            {venues.map(v => (
                                <option key={v.venue_id} value={v.venue_id}>{v.venue_name || v.venue_id}</option>
                            ))}
                        </select>
                    )}
                    {label === "Damage Fee (Rs)" && (
                        <input
                            type="number"
                            className="border rounded p-1"
                            value={selectedVenue.damageFee}
                            onChange={e => setSelectedVenue({ "damageFee": e.target.value, "refundAmount": "", "depositAmount": "", "status": "" })}
                        />
                    )}
                    {label === "Guests" && (
                        <input
                            type="number"
                            className="border rounded p-1"
                            value={selectedVenue.number_of_guests}
                            onChange={e => setSelectedVenue({ "number_of_guests": e.target.value })}
                        />
                    )}
                    {label === "Additional Hours" && (
                        <input
                            type="number"
                            className="border rounded p-1"
                            value={selectedVenue.additionalHours}
                            onChange={e => setSelectedVenue({ "additionalHours": e.target.value })}
                        />
                    )}
                    <div className="flex gap-2 mt-1">
                        <button
                            className="px-2 py-1 bg-green-500 text-white rounded"
                            disabled={saving || !selectedVenue || selectedVenue === value}
                            onClick={async () => {
                                setSaving(true);
                                try {
                                    if (label === "Venue ID") {
                                        await updateBookingVenue(bookingId, selectedVenue);
                                        setRefresh(true);
                                        setEdit(false);
                                    } else if (label === "Status") {
                                        await updateBookingStatus(bookingId, selectedVenue);
                                        setRefresh(true);
                                        setEdit(false);
                                    } else if (label === "Damage Fee (Rs)") {
                                        await updateDamageFee(bookingId, selectedVenue);
                                        setRefresh(true);
                                        setEdit(false);
                                    } else if (label === "Guests") {
                                        await updateBookingGuest(bookingId, selectedVenue)
                                        setRefresh(true);
                                        setEdit(false);
                                    } else if (label === "Additional Hours") {
                                        await updateAdditionalHours(bookingId, selectedVenue);
                                        setRefresh(true);
                                        setEdit(false);
                                    }
                                } catch (err) {
                                    console.log(err);
                                    const msg =
                                        err?.response?.data?.message ||
                                        err?.response?.data?.msg ||
                                        err?.message ||
                                        'Failed to update';
                                    alert(`Error: ${msg}`);
                                }
                                setSaving(false);
                                setCanselbtn(false);
                            }}
                        >
                            {saving ? 'Saving...' : 'Confirm'}
                        </button>
                        <button
                            className="px-2 py-1 bg-gray-300 rounded"
                            onClick={() => { setEdit(false); setSelectedVenue(value); setCanselbtn(false); }}
                            disabled={saving}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );

    return (
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
    const [refresh, setRefresh] = useState(false);
    const [textBuffer, setTextBuffer] = useState(null);
    const [cancelbtn, setCanselbtn] = useState(false);

    useEffect(() => {
        async function fetchBooking() {
            try {
                const res = await getBookingDetails(bookingId)
                // Wait 3 seconds before setting booking and loading
                setTimeout(() => {
                    setBooking(res.data);
                    setLoading(false);
                    setRefresh(false);
                }, 500);
            } catch (err) {
                setError('Failed to load booking details');
                setLoading(false);
            }
        }
        fetchBooking();
    }, [bookingId, refresh]);

    //if (loading) return <div className="p-6">Loading...</div>;
    if (error) return <div className="p-6 text-red-600">{error}</div>;

    const b = booking;
    // Format ISO dates to readable
    const formatDate = (iso) => new Date(iso).toLocaleDateString();

    // Handler to update venue in booking state
    const handleVenueUpdated = (newVenueId) => {
        setBooking(prev => ({ ...prev, venue_id: newVenueId }));
    };

    return (
        <div className=" w-full fixed m-auto bg-black left-0 top-0 right-0 bottom-0 bg-opacity-10 flex justify-center p-16 overflow-y-auto z-50">
            <div className="flex flex-col align-middle justify-center bg-white rounded-lg p-6 w-3/4">
                <h1 class="flex items-end ml-12 text-xl font-extrabold dark:text-white mb-3">Advance<span class="bg-blue-100 text-blue-800 text-2xl font-semibold me-2 px-2.5 py-0.5 rounded-sm dark:bg-blue-200 dark:text-blue-800 ms-2"> View</span></h1>
                {/* Booking Information */}
                {(loading ? <div className='flex flex-row justify-center gap gap-5'>
                    {/* Loading... */}

                    <div className='flex flex-col gap-4'>
                        <div role="status" class="max-w-sm p-4 border border-gray-100 rounded-sm shadow-sm animate-pulse md:p-6 dark:border-gray-700">

                            <div class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
                            <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                            <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                            <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                            <div class="flex items-center mt-4">
                                <div>
                                    <div class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32 mb-2"></div>
                                    <div class="w-48 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                                </div>
                            </div>
                            <span class="sr-only">Loading...</span>
                        </div>
                        <div role="status" class="max-w-sm p-4 border border-gray-100 rounded-sm shadow-sm animate-pulse md:p-6 dark:border-gray-700">

                            <div class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
                            <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                            <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                            <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                            <div class="flex items-center mt-4">
                                <div>
                                    <div class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32 mb-2"></div>
                                    <div class="w-48 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                                </div>
                            </div>
                            <span class="sr-only">Loading...</span>
                        </div>
                    </div>

                    <div role="status" class=" max-w-md p-4 border border-gray-100 space-y-4 divide-y divide-gray-200 rounded-sm shadow-sm animate-pulse dark:divide-gray-700 md:p-6 dark:border-gray-700">
                        <div class="flex items-center justify-between">
                            <div>
                                <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-80 mb-2.5"></div>
                                <div class="min-w-96 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                            </div>
                            <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
                        </div>
                        <div class="flex items-center justify-between pt-4">
                            <div>
                                <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-80 mb-2.5"></div>
                                <div class="min-w-96 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                            </div>
                            <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
                        </div>
                        <div class="flex items-center justify-between pt-4">
                            <div>
                                <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-80 mb-2.5"></div>
                                <div class="min-w-96 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                            </div>
                            <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
                        </div>
                        <div class="flex items-center justify-between pt-4">
                            <div>
                                <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-80 mb-2.5"></div>
                                <div class="min-w-96 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                            </div>
                            <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
                        </div>
                        <div class="flex items-center justify-between pt-4">
                            <div>
                                <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-80 mb-2.5"></div>
                                <div class="min-w-96 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                            </div>
                            <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
                        </div>
                        <span class="sr-only">Loading...</span>
                    </div>
                </div>

                    : <div className='flex flex-row justify-center gap gap-10 border'>
                        <div className='flex flex-col'>
                            <section>
                                <h2 className="text-base font-semibold text-gray-800 mb-2">Booking Information</h2>
                                <div className="border grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <DetailRow label="Booking ID" value={b.booking_id} />
                                    <DetailRow label="Date" value={formatDate(b.booking_date)} />
                                    <DetailRow label="Time Slot" value={b.time_slot} />
                                    <DetailRow
                                        label="Status"
                                        value={b.status}
                                        bookingId={b.booking_id}
                                        setRefresh={setRefresh}
                                        setCanselbtn ={setCanselbtn}
                                    />
                                    <DetailRow
                                        label="Venue ID"
                                        value={b.venue_id}
                                        bookingId={b.booking_id}
                                        setRefresh={setRefresh}
                                        setCanselbtn ={setCanselbtn}
                                    />
                                    <DetailRow label="Customer ID" value={b.customer_id} />
                                    <DetailRow
                                        label="Guests"
                                        value={b.number_of_guests}
                                        bookingId={b.booking_id}
                                        setRefresh={setRefresh}
                                        setCanselbtn ={setCanselbtn}
                                    />
                                    <DetailRow
                                        label="Additional Hours"
                                        value={b.additional_hours}
                                        bookingId={b.booking_id}
                                        setRefresh={setRefresh}
                                        refresh={refresh}
                                        setCanselbtn ={setCanselbtn}
                                    />
                                </div>
                            </section>

                            {/* Contract Information */}
                            <section className='mt-5 border'>
                                <h2 className="text-base font-semibold text-gray-800 mb-2">Contract Information</h2>
                                <div className="border grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <DetailRow label="Contract ID" value={b.contract_id} />
                                    <DetailRow label="Deposit Amount (Rs)" value={b.deposit_amount} />
                                    <DetailRow
                                        label="Damage Fee (Rs)"
                                        value={b.damage_fee}
                                        bookingId={b.booking_id}
                                        setRefresh={setRefresh}
                                        setCanselbtn ={setCanselbtn}
                                    />
                                    <DetailRow label="Refund Amount (Rs)" value={b.refund_amount} />
                                    <DetailRow label="Contract Status" value={b.contract_status} />
                                </div>
                            </section>
                        </div>`

                        {/* Pricing Information */}
                        <section>
                            <h2 className="text-base font-semibold text-gray-800 mb-2">Pricing Information</h2>
                            <div className="border grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <DetailRow label="Menu Price Total (Rs)" value={b.menu_price_total} />
                                <DetailRow label="Hall Charge (Rs)" value={b.hall_charge} />
                                <DetailRow label="Extra Hour Price (Rs)" value={b.extra_hour_fee} />
                                <DetailRow label="Bites Price (Rs)" value={b.bites_payment} />
                                <DetailRow label="Liquor Price (Rs)" value={b.fountain_payment} />
                                <DetailRow label="Soft Drink Price (Rs)" value={b.other_payment} />
                                <DetailRow label="Overall Total (Rs)" value={b.overall_total} />
                                <DetailRow label="Forfeited Deposit (Rs)" value={b.forfeited_deposit} />
                            </div>
                        </section>
                    </div>)}
                <div className="flex justify-end mt-4">
                    <button
                        onClick={onClose}
                        className={`px-4 py-2 bg-gray-200 rounded-lg mr-2 ${cancelbtn ? 'hidden' : 'visible'}`}
                    >
                        Cancel
                    </button>
                </div>
            </div>

        </div>
    );
}
