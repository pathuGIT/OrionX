import React, { useState, useEffect } from 'react';
import { getAllCustomers, getCustomerBookings, searchCustomer, updateCustomer, deleteCustomer } from '../../services/CustomerServise';
import BookingDetailsView from '../../components/bookings/BookingDetailsView';
import { registerCustomer, updateCustomerPassword } from '../../services/AuthService';

const ManageCustomer = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [customers, setCustomers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [originalCustomerStatus, setOriginalCustomerStatus] = useState(null); // Track original status

    const [bookings, setBookings] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showBookingsModal, setShowBookingsModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [password, setPassword] = useState('');
    // Inside the component
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [customerToDelete, setCustomerToDelete] = useState(null);
    const [bookingCounts, setBookingCounts] = useState({}); // Track booking counts per customer

    // New function to load booking counts
    const loadBookingCounts = async () => {
        const counts = {};
        for (const customer of customers) {
            try {
                const bookings = await getCustomerBookings(customer.customer_id);
                counts[customer.customer_id] = bookings.length;
            } catch (error) {
                console.error(`Error loading bookings for customer ${customer.customer_id}:`, error);
                counts[customer.customer_id] = 0;
            }
        }
        setBookingCounts(counts);
    };

    // Update booking counts when customers change
    useEffect(() => {
        if (customers.length > 0) {
            loadBookingCounts();
        }
    }, [customers]);

    useEffect(() => {
        loadCustomers();
    }, []);


    const handleEditCustomer = (customer) => {
        setSelectedCustomer(customer);
        setOriginalCustomerStatus(customer.staus); // Store original status
        setShowEditModal(true);
        setPassword(''); // Reset password when opening modal
    };

    const handleUpdateCustomer = async (e) => {
        e.preventDefault();
        try {
            // Prepare update data
            const updateData = {
                name: selectedCustomer.name,
                email: selectedCustomer.email,
                phone: selectedCustomer.phone,
                address: selectedCustomer.address,
                staus: selectedCustomer.staus
            };

            // Register customer if changing from inactive to active
            if (originalCustomerStatus === 'inactive' && selectedCustomer.staus === 'active' && password) {
                console.log('Registering customer with password:', password, selectedCustomer.customer_id);
                try {
                    await registerCustomer({
                        password: password,
                        customer_id: selectedCustomer.customer_id
                    });
                } catch (error) {
                    console.error('Registration error:', error);
                    alert('Registration failed. Please try again.');
                    return;
                }
            }

            await updateCustomer(selectedCustomer.customer_id, updateData);
            //await updateCustomerPassword(selectedCustomer.customer_id, updateData);
            await loadCustomers();
            setShowEditModal(false);
        } catch (error) {
            console.error('Update failed:', error);
        }
    };

    const handleDeleteCustomer = async (customer) => {
        try {
            // Check if customer has bookings
            const bookings = await getCustomerBookings(customer.customer_id);

            if (bookings.length > 0) {
                alert('Cannot delete customer with existing bookings');
                return;
            }

            setCustomerToDelete(customer);
            setShowDeleteConfirmation(true);
        } catch (error) {
            console.error('Error checking bookings:', error);
        }
    };

    const confirmDelete = async () => {
        try {
            await deleteCustomer(customerToDelete.customer_id);
            await loadCustomers();
            setShowDeleteConfirmation(false);
        } catch (error) {
            console.error('Delete failed:', error);
        }
    };

    const handleDateClick = (booking_id) => {
        if (booking_id) {
            setSelectedBooking(booking_id);
        }
    };

    const loadCustomers = async () => {
        setIsLoading(true);
        try {
            const data = await getAllCustomers();
            setCustomers(data);
        } catch (error) {
            console.error('Error loading customers:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const data = await searchCustomer(searchTerm);
            setCustomers(data);
        } catch (error) {
            console.error('Search failed:', error);
        }
    };


    const handleViewBookings = async (customerId) => {
        try {
            const data = await getCustomerBookings(customerId);
            setBookings(data);
            setShowBookingsModal(true);
        } catch (error) {
            console.error('Failed to load bookings:', error);
        }
    };

    return (
        <div className="p-6 max-w-screen-2xl mx-auto">
            {isLoading && (
                <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50">
                    <div className="animate-spin rounded-full h-8 w-8 border-4 border-t-transparent border-blue-500"></div>
                </div>
            )}

            {/* Search Bar */}
            <div className="mb-6">
                <form onSubmit={handleSearch} className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Search by name, email, or ID"
                        className="flex-1 p-2 border rounded"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Search
                    </button>
                    <button
                        type="button"
                        onClick={loadCustomers}
                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                    >
                        Reset
                    </button>
                </form>
            </div>

            {/* Customers Table */}
            <div className="max-h-[400px] sm:max-h-[600px] overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Address</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {customers.map(customer => (
                            <tr key={customer.customer_id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">{customer.customer_id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">{customer.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">{customer.address}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">{customer.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">{customer.phone}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 py-1 text-xs rounded-full ${customer.staus === 'active'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                        }`}>
                                        {customer.staus == 'active' ? 'Active' : 'Not Registered'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap space-x-2">

                                    <button
                                        onClick={() => handleViewBookings(customer.customer_id)}
                                        className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-100"
                                        title="Bookings"
                                    >
                                        {/* Optional: Add a bookings icon here if needed */}
                                        Bookings
                                    </button>
                                    <button
                                        onClick={() => handleEditCustomer(customer)}
                                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-100"
                                        title="Edit"
                                    >
                                        {/* Edit Icon */}
                                        <svg class="w-[21px] h-[21px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z" />
                                        </svg>
                                    </button>

                                    {/* Conditionally show Delete Button */}
                                    {bookingCounts[customer.customer_id] === 0 && (
                                        <button
                                            onClick={() => handleDeleteCustomer(customer)}
                                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-100"
                                            title="Delete"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    )}
                                </td>
                                {showDeleteConfirmation && (
                                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                                        <div className="bg-white rounded-lg p-6 w-full max-w-md">
                                            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
                                            <p className="mb-4">
                                                Are you sure you want to delete customer {customerToDelete?.name}?
                                            </p>
                                            <div className="flex justify-end space-x-3">
                                                <button
                                                    onClick={() => setShowDeleteConfirmation(false)}
                                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={confirmDelete}
                                                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Edit Customer Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-semibold mb-4">Edit Customer</h3>
                        <form onSubmit={handleUpdateCustomer}>
                            <div className="space-y-4">
                                {/* Name Field */}
                                <div>
                                    <label className="block text-sm font-medium mb-1">Name</label>
                                    <input
                                        type="text"
                                        value={selectedCustomer.name || ''}
                                        onChange={(e) => setSelectedCustomer({ ...selectedCustomer, name: e.target.value })}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>

                                {/* Email Field */}
                                <div>
                                    <label className="block text-sm font-medium mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={selectedCustomer.email || ''}
                                        onChange={(e) => setSelectedCustomer({ ...selectedCustomer, email: e.target.value })}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>

                                {/* Phone Field */}
                                <div>
                                    <label className="block text-sm font-medium mb-1">Phone</label>
                                    <input
                                        type="tel"
                                        value={selectedCustomer.phone || ''}
                                        onChange={(e) => setSelectedCustomer({ ...selectedCustomer, phone: e.target.value })}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>

                                {/* Address Field */}
                                <div>
                                    <label className="block text-sm font-medium mb-1">Address</label>
                                    <input
                                        type="text"
                                        value={selectedCustomer.address || ''}
                                        onChange={(e) => setSelectedCustomer({ ...selectedCustomer, address: e.target.value })}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>

                                {/* Status Field */}
                                <div>
                                    <label className="block text-sm font-medium mb-1">Status</label>
                                    <select
                                        value={selectedCustomer?.staus || 'active'}
                                        onChange={(e) => {
                                            const newStatus = e.target.value;
                                            setSelectedCustomer(prev => ({
                                                ...prev,
                                                staus: newStatus
                                            }));
                                        }}
                                        className="w-full p-2 border rounded"
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Not Registered</option>
                                    </select>

                                    {/* Show password field only when changing from inactive to active */}
                                    {originalCustomerStatus === 'inactive' &&
                                        selectedCustomer.staus === 'active' && (
                                            <div className="mt-2">
                                                <input
                                                    type="password"
                                                    placeholder="Enter password"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    className="w-full p-2 border rounded mb-2"
                                                    required
                                                />
                                                <p className="text-sm text-gray-500 mb-2">
                                                    Password is required to activate this customer
                                                </p>
                                            </div>
                                        )}
                                </div>

                                <div className="flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowEditModal(false)}
                                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Bookings Modal */}
            {showBookingsModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    {selectedBooking && (
                        <BookingDetailsView
                            bookingId={selectedBooking}
                            onClose={() => setSelectedBooking(null)}
                        />
                    )}
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
                        <h3 className="text-lg font-semibold mb-4">Customer Bookings</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booking ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Venue</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Guests</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {bookings.map(booking => (
                                        <tr key={booking.booking_id} onClick={() => handleDateClick(booking.booking_id)} className='cursor-pointer hover:bg-slate-200'>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">{booking.booking_id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                {new Date(booking.booking_date).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">{booking.venue_name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">{booking.number_of_guests}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <span className={`px-2 py-1 text-xs rounded-full ${booking.status === 'confirmed'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {booking.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <button
                            onClick={() => setShowBookingsModal(false)}
                            className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};


export default ManageCustomer;