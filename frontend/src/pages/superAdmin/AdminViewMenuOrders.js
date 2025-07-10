import React, { useEffect, useState } from 'react';
import { getAllStructuredMenuSelections } from "../../services/MenuService";
import { format } from 'date-fns';

const AdminMenuOrdersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedBooking, setExpandedBooking] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getAllStructuredMenuSelections();
        setCustomers(response);
      } catch (err) {
        console.error("Failed to load data:", err);
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleBookingDetails = (bookingId) => {
    setExpandedBooking(expandedBooking === bookingId ? null : bookingId);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6 m-5">
        <h2 className="text-xl font-bold text-red-600 mb-2">Error Loading Data</h2>
        <p className="text-gray-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-700">
          <h1 className="text-2xl font-bold text-white">Customer Menu Orders</h1>
          <p className="text-blue-100">View and manage all customer menu selections</p>
        </div>
        
        <div className="p-6">
          {customers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No menu orders found</p>
            </div>
          ) : (
            <div className="space-y-6">
              {customers.map((customer) => (
                <div key={customer.customer_id} className="space-y-4">
                  <h2 className="text-xl font-bold text-gray-800 border-b pb-2">
                    {customer.name} ({customer.email})
                  </h2>
                  
                  {customer.bookings.map((booking) => (
                    <div key={booking.booking_id} className="border rounded-lg overflow-hidden">
                      <div 
                        className="p-4 bg-gray-50 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                        onClick={() => toggleBookingDetails(booking.booking_id)}
                      >
                        <div>
                          <h3 className="font-bold text-lg text-gray-800">
                            Booking ID: {booking.booking_id}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Date: {booking.booking_date ? format(new Date(booking.booking_date), 'MMMM do, yyyy') : 'No date available'}
                          </p>
                          <p className="text-sm text-gray-600">
                            Guests: {booking.number_of_guests} • Status: {booking.status}
                          </p>
                        </div>
                        <div className="flex items-center">
                          <span className="mr-2 text-sm text-gray-600">
                            {booking.menus?.length || 0} menu type(s)
                          </span>
                          <svg
                            className={`w-5 h-5 text-gray-500 transform transition-transform ${expandedBooking === booking.booking_id ? 'rotate-180' : ''}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                      
                      {expandedBooking === booking.booking_id && (
                        <div className="p-4 border-t">
                          <div className="space-y-6">
                            {booking.menus?.map((menu) => (
                              <div key={menu.menu_type_id} className="bg-white rounded-lg shadow-sm border p-4">
                                <div className="flex justify-between items-center mb-3">
                                  <div className="flex items-center">
                                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                                    <h4 className="font-semibold text-lg text-gray-800">
                                      {menu.menu_list_name} - {menu.menu_type_name}
                                    </h4>
                                  </div>
                                  <span className="text-lg font-bold text-blue-600">
                                    Rs. 4300.00
                                  </span>
                                </div>
                                
                                <div className="ml-6 space-y-4">
                                  {menu.categories?.map((category) => (
                                    <div key={category.category_id} className="border-l-2 border-blue-200 pl-4">
                                      <h5 className="font-medium text-gray-700 mb-2">
                                        {category.category_name} (Selected: {category.items?.length || 0}/{category.item_limit})
                                      </h5>
                                      
                                      <ul className="space-y-2 ml-4">
                                        {category.items?.map((item) => (
                                          <li key={item.ICMT_Id}>
                                            <p className="font-medium text-gray-800">{item.item_name}</p>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminMenuOrdersPage;