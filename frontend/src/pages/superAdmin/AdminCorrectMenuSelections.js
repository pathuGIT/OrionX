import React, { useEffect, useState } from 'react';
import {
  getAllStructuredMenuSelections,
  updateMenuStructure,
  getMenuOverview,
  getStructuredSelectionsByBookingId
} from "../../services/MenuService";
import { format } from 'date-fns';

const AdminMenuOrdersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [menuOverview, setMenuOverview] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [currentSelections, setCurrentSelections] = useState([]);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [selectionsResponse, overviewResponse] = await Promise.all([
          getAllStructuredMenuSelections(),
          getMenuOverview()
        ]);
        setCustomers(Array.isArray(selectionsResponse) ? selectionsResponse : []);
        setMenuOverview(Array.isArray(overviewResponse) ? overviewResponse : []);
      } catch (err) {
        console.error("Failed to load data:", err);
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleOpenMenuEditor = async (booking) => {
    try {
      const selections = await getStructuredSelectionsByBookingId(booking.booking_id);
      setCurrentSelections(Array.isArray(selections) ? selections : []);
      setSelectedBooking(booking);
    } catch (err) {
      console.error("Error fetching menu selections:", err);
      alert("Failed to load menu selections. Please try again.");
    }
  };

  const handleCloseMenuEditor = () => {
    setSelectedBooking(null);
    setCurrentSelections([]);
  };

  const handleSaveMenuSelections = async () => {
    if (!selectedBooking) return;
    
    try {
      // Prepare the payload for update
      const payload = {
        bookingId: selectedBooking.booking_id,
        selections: (Array.isArray(currentSelections) ? currentSelections : []).map(selection => ({
          ICMT_Id: selection.ICMT_Id,
          menuListId: selection.menu_list_id,
          menuTypeId: selection.menu_type_id,
          categoryId: selection.category_id,
          itemId: selection.item_id
        }))
      };

      await updateMenuStructure(payload);
      showSuccessMessage("Menu updated successfully!");
      
      // Refresh the data
      const response = await getAllStructuredMenuSelections();
      setCustomers(Array.isArray(response) ? response : []);
      handleCloseMenuEditor();
    } catch (err) {
      console.error("Error updating menu selections:", err);
      alert("Failed to update menu selections. Please try again.");
    }
  };

  const handleItemSelection = (menuListId, menuTypeId, categoryId, itemId, isSelected) => {
    setCurrentSelections(prev => {
      const currentSelections = Array.isArray(prev) ? prev : [];
      
      if (isSelected) {
        // Add the item to selections
        const menuList = Array.isArray(menuOverview) ? menuOverview.find(ml => ml.id === menuListId) : null;
        const menuType = menuList?.types?.find(mt => mt.id === menuTypeId);
        const category = menuType?.categories?.find(cat => cat.id === categoryId);
        const item = category?.items?.find(i => i.id === itemId);
        
        if (!menuList || !menuType || !category || !item) return currentSelections;
        
        return [
          ...currentSelections,
          {
            booking_id: selectedBooking?.booking_id,
            menu_list_id: menuListId,
            menu_list_name: menuList.name,
            menu_type_id: menuTypeId,
            menu_type_name: menuType.name,
            category_id: categoryId,
            category_name: category.name,
            item_id: itemId,
            item_name: item.name,
            ICMT_Id: `${itemId}_${categoryId}_${menuTypeId}_${menuListId}` // Generate a unique ID
          }
        ];
      } else {
        // Remove the item from selections
        return currentSelections.filter(sel => 
          !(sel.menu_list_id === menuListId && 
            sel.menu_type_id === menuTypeId && 
            sel.category_id === categoryId && 
            sel.item_id === itemId)
        );
      }
    });
  };

  const isItemSelected = (menuListId, menuTypeId, categoryId, itemId) => {
    const selections = Array.isArray(currentSelections) ? currentSelections : [];
    return selections.some(sel => 
      sel.menu_list_id === menuListId && 
      sel.menu_type_id === menuTypeId && 
      sel.category_id === categoryId && 
      sel.item_id === itemId
    );
  };

  const getSelectedCountForCategory = (menuListId, menuTypeId, categoryId) => {
    const selections = Array.isArray(currentSelections) ? currentSelections : [];
    return selections.filter(sel => 
      sel.menu_list_id === menuListId && 
      sel.menu_type_id === menuTypeId && 
      sel.category_id === categoryId
    ).length;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          <p className="mt-3 text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-red-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {successMessage && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center animate-fade-in">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            {successMessage}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Customer Menu Orders</h1>
          <p className="mt-2 text-gray-600">View and manage all customer menu selections</p>
        </div>

        {customers.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No orders found</h3>
            <p className="mt-1 text-gray-500">There are currently no menu orders to display</p>
          </div>
        ) : (
          <div className="space-y-6">
            {customers.map((customer) => (
              <div key={customer.customer_id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                      <span className="text-indigo-600 font-medium">
                        {customer.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </span>
                    </div>
                    <div className="ml-4">
                      <h2 className="text-lg font-semibold text-gray-900">{customer.name}</h2>
                      <p className="text-sm text-gray-500">{customer.email}</p>
                    </div>
                  </div>
                </div>
                
                <div className="divide-y divide-gray-100">
                  {customer.bookings?.map((booking) => (
                    <div key={booking.booking_id} className="p-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-base font-medium text-gray-900">
                            Booking #{booking.booking_id}
                          </h3>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {booking.status}
                            </span>
                            <span className="text-sm text-gray-500">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {booking.booking_date ? format(new Date(booking.booking_date), 'MMMM do, yyyy') : 'No date'}
                            </span>
                            <span className="text-sm text-gray-500">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                              </svg>
                              {booking.number_of_guests} guests
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleOpenMenuEditor(booking)}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                          Change Menu
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Menu Selection Modal */}
        {selectedBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-800">
                    Edit Menu for Booking #{selectedBooking.booking_id}
                  </h2>
                  <button 
                    onClick={handleCloseMenuEditor}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  Customer: {customers.find(c => c.bookings?.some(b => b.booking_id === selectedBooking.booking_id))?.name}
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-8">
                  {menuOverview.map((menuList) => (
                    <div key={menuList.id} className="bg-gray-50 rounded-lg p-5">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        {menuList.name}
                        <span className="ml-2 text-sm font-normal text-gray-500">
                          {menuList.description}
                        </span>
                      </h3>
                      
                      <div className="space-y-6">
                        {menuList.types?.map((menuType) => (
                          <div key={menuType.id} className="pl-4 border-l-2 border-indigo-100">
                            <h4 className="text-md font-medium text-gray-800 mb-3">
                              {menuType.name}
                              <span className="ml-2 text-sm font-normal text-indigo-600">
                                Rs. {menuType.price}
                              </span>
                            </h4>
                            
                            <div className="space-y-4">
                              {menuType.categories?.map((category) => (
                                <div key={category.id} className="pl-4 border-l-2 border-gray-200">
                                  <h5 className="text-sm font-medium text-gray-700 mb-2">
                                    {category.name}
                                    <span className="ml-2 text-xs font-normal text-gray-500">
                                      (Select up to {category.limit} items)
                                    </span>
                                    <span className="ml-2 text-xs font-medium text-indigo-600">
                                      {getSelectedCountForCategory(menuList.id, menuType.id, category.id)} selected
                                    </span>
                                  </h5>
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {category.items?.map((item) => {
                                      const isSelected = isItemSelected(
                                        menuList.id, 
                                        menuType.id, 
                                        category.id, 
                                        item.id
                                      );
                                      
                                      return (
                                        <div 
                                          key={item.id}
                                          onClick={() => handleItemSelection(
                                            menuList.id, 
                                            menuType.id, 
                                            category.id, 
                                            item.id, 
                                            !isSelected
                                          )}
                                          className={`p-3 border rounded-lg cursor-pointer transition-all ${
                                            isSelected
                                              ? 'border-indigo-500 bg-indigo-50 transform scale-[1.02] shadow-md'
                                              : 'border-gray-200 hover:bg-gray-50 hover:shadow-sm'
                                          }`}
                                        >
                                          <div className="flex justify-between items-start">
                                            <div>
                                              <div className="font-medium text-gray-800">{item.name}</div>
                                              {item.description && (
                                                <div className="text-xs text-gray-500 mt-1">{item.description}</div>
                                              )}
                                            </div>
                                            <div className="text-sm text-indigo-600 font-medium">
                                              Rs. {item.price}
                                            </div>
                                          </div>
                                          {isSelected && (
                                            <div className="mt-2 flex justify-end">
                                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                              </svg>
                                            </div>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="p-4 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  onClick={handleCloseMenuEditor}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveMenuSelections}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition duration-200"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMenuOrdersPage;