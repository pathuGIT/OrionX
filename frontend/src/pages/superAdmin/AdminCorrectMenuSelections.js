import React, { useEffect, useState } from 'react';
import { 
  getAllStructuredMenuSelections,
  updateMenuSelection,
  deleteMenuSelection,
  getMenuOverview,
  updateMenuStructure
} from "../../services/MenuService";
import { format } from 'date-fns';

const AdminMenuOrdersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedBooking, setExpandedBooking] = useState(null);
  const [menuOverview, setMenuOverview] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [availableOptions, setAvailableOptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editMode, setEditMode] = useState('item'); // 'item', 'category', 'menuType', 'menuList'
  const [availableMenuLists, setAvailableMenuLists] = useState([]);
  const [availableMenuTypes, setAvailableMenuTypes] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [currentMenu, setCurrentMenu] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [selectionsResponse, overviewResponse] = await Promise.all([
          getAllStructuredMenuSelections(),
          getMenuOverview()
        ]);
        setCustomers(selectionsResponse);
        setMenuOverview(overviewResponse);
        setAvailableMenuLists(overviewResponse);
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

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const startEdit = (item, bookingId, menuTypeId, categoryId, currentMenuListId) => {
    setEditingItem({
      ...item,
      bookingId,
      menuTypeId,
      categoryId,
      currentMenuListId
    });
    setEditMode('item');
    
    // Find available options for this category
    if (menuOverview) {
      const menuList = menuOverview.find(ml => ml.id === currentMenuListId);
      if (menuList) {
        const menuType = menuList.types.find(mt => mt.id === menuTypeId);
        if (menuType) {
          const category = menuType.categories.find(cat => cat.id === categoryId);
          if (category) {
            setAvailableOptions(category.items);
            setCurrentMenu({
              menuList: menuList.name,
              menuType: menuType.name,
              category: category.name
            });
          }
        }
      }
    }
  };

  const prepareMenuTypeChange = (currentMenuListId, bookingId, currentMenuTypeId) => {
    setEditMode('menuType');
    setEditingItem({ 
      bookingId, 
      currentMenuListId,
      currentMenuTypeId
    });
    
    // Get all menu types for the current menu list
    const currentMenuList = menuOverview.find(ml => ml.id === currentMenuListId);
    if (currentMenuList) {
      setAvailableMenuTypes(currentMenuList.types);
      setCurrentMenu({
        menuList: currentMenuList.name,
        currentMenuType: currentMenuList.types.find(mt => mt.id === currentMenuTypeId)?.name
      });
    }
  };

  const prepareCategoryChange = (menuTypeId, bookingId, currentMenuListId, currentCategoryId) => {
    setEditMode('category');
    setEditingItem({ 
      bookingId, 
      menuTypeId,
      currentMenuListId,
      currentCategoryId
    });
    
    // Get all categories for the selected menu type
    const menuList = menuOverview.find(ml => ml.id === currentMenuListId);
    if (menuList) {
      const menuType = menuList.types.find(mt => mt.id === menuTypeId);
      if (menuType) {
        setAvailableCategories(menuType.categories);
        setCurrentMenu({
          menuList: menuList.name,
          menuType: menuType.name,
          currentCategory: menuType.categories.find(cat => cat.id === currentCategoryId)?.name
        });
      }
    }
  };

  const prepareMenuListChange = (bookingId, currentMenuListId) => {
    setEditMode('menuList');
    setEditingItem({ 
      bookingId,
      currentMenuListId
    });
    setAvailableMenuLists(menuOverview);
    setCurrentMenu({
      currentMenuList: menuOverview.find(ml => ml.id === currentMenuListId)?.name
    });
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setAvailableOptions([]);
    setEditMode('item');
    setCurrentMenu(null);
  };

  const handleOptionSelect = (option) => {
    if (editMode === 'item') {
      setEditingItem(prev => ({
        ...prev,
        ICMT_Id: option.id,
        item_id: option.id,
        item_name: option.name
      }));
    } else if (editMode === 'category') {
      setEditingItem(prev => ({
        ...prev,
        categoryId: option.id,
        categoryName: option.name
      }));
    } else if (editMode === 'menuType') {
      setEditingItem(prev => ({
        ...prev,
        menuTypeId: option.id,
        menuTypeName: option.name
      }));
    } else if (editMode === 'menuList') {
      setEditingItem(prev => ({
        ...prev,
        menuListId: option.id,
        menuListName: option.name
      }));
    }
  };

  const saveEdit = async () => {
    if (!editingItem) return;
    
    try {
      if (editMode === 'item') {
        await updateMenuSelection(
          editingItem.bookingId,
          editingItem.originalICMTId || editingItem.ICMT_Id,
          { ICMT_Id: editingItem.ICMT_Id }
        );
        showSuccessMessage("Menu item updated successfully!");
      } else {
        // For menu list, type, or category changes
        const payload = {
          bookingId: editingItem.bookingId,
          currentMenuListId: editingItem.currentMenuListId
        };
        
        if (editMode === 'menuList') {
          payload.newMenuListId = editingItem.menuListId;
        } else if (editMode === 'menuType') {
          payload.newMenuTypeId = editingItem.menuTypeId;
          payload.currentMenuTypeId = editingItem.currentMenuTypeId;
        } else if (editMode === 'category') {
          payload.newCategoryId = editingItem.categoryId;
          payload.currentCategoryId = editingItem.currentCategoryId;
          payload.menuTypeId = editingItem.menuTypeId;
        }
        
        await updateMenuStructure(payload);
        showSuccessMessage(`Menu ${editMode} updated successfully!`);
      }
      
      // Refresh data
      const response = await getAllStructuredMenuSelections();
      setCustomers(response);
      cancelEdit();
    } catch (err) {
      console.error("Error updating menu selection:", err);
      alert("Failed to update selection. Please try again.");
    }
  };

  const handleDelete = async (bookingId, ICMT_Id) => {
    if (!window.confirm("Are you sure you want to remove this menu item?")) return;
    
    try {
      await deleteMenuSelection(bookingId, ICMT_Id);
      showSuccessMessage("Menu item deleted successfully!");
      
      // Refresh data
      const response = await getAllStructuredMenuSelections();
      setCustomers(response);
    } catch (err) {
      console.error("Error deleting menu selection:", err);
      alert("Failed to delete selection. Please try again.");
    }
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesCustomer = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesBooking = customer.bookings.some(booking => 
      booking.booking_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.status.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return matchesCustomer || matchesBooking;
  });

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
          
          <div className="mt-4 relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search customers or bookings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {editingItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">
                    {editMode === 'item' && 'Edit Menu Item'}
                    {editMode === 'category' && 'Change Menu Category'}
                    {editMode === 'menuType' && 'Change Menu Type'}
                    {editMode === 'menuList' && 'Change Menu List'}
                  </h2>
                  <button 
                    onClick={cancelEdit}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
                
                <div className="mb-4 bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Customer:</span> {customers.find(c => 
                      c.bookings.some(b => b.booking_id === editingItem.bookingId))?.name || 'Unknown'}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Booking ID:</span> {editingItem.bookingId}
                  </p>
                  
                  {currentMenu && (
                    <div className="mt-2 pt-2 border-t border-blue-100">
                      {editMode === 'item' && (
                        <>
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">Menu List:</span> {currentMenu.menuList}
                          </p>
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">Menu Type:</span> {currentMenu.menuType}
                          </p>
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">Category:</span> {currentMenu.category}
                          </p>
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">Current Item:</span> {editingItem.item_name}
                          </p>
                        </>
                      )}
                      {editMode === 'category' && (
                        <>
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">Menu List:</span> {currentMenu.menuList}
                          </p>
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">Menu Type:</span> {currentMenu.menuType}
                          </p>
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">Current Category:</span> {currentMenu.currentCategory}
                          </p>
                        </>
                      )}
                      {editMode === 'menuType' && (
                        <>
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">Menu List:</span> {currentMenu.menuList}
                          </p>
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">Current Menu Type:</span> {currentMenu.currentMenuType}
                          </p>
                        </>
                      )}
                      {editMode === 'menuList' && (
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Current Menu List:</span> {currentMenu.currentMenuList}
                        </p>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="mb-6">
                  <h3 className="font-medium text-gray-700 mb-2">
                    {editMode === 'item' && 'Select New Menu Item'}
                    {editMode === 'category' && 'Select New Category'}
                    {editMode === 'menuType' && 'Select New Menu Type'}
                    {editMode === 'menuList' && 'Select New Menu List'}
                  </h3>
                  
                  {(editMode === 'item' && availableOptions.length > 0) ? (
                    <div className="space-y-2 max-h-60 overflow-y-auto p-2">
                      {availableOptions.map(option => (
                        <div 
                          key={option.id}
                          onClick={() => handleOptionSelect(option)}
                          className={`p-3 border rounded-lg cursor-pointer transition-all ${
                            editingItem.ICMT_Id === option.id
                              ? 'border-indigo-500 bg-indigo-50 transform scale-[1.02] shadow-md'
                              : 'border-gray-200 hover:bg-gray-50 hover:shadow-sm'
                          }`}
                        >
                          <div className="font-medium text-gray-800">{option.name}</div>
                          {option.description && (
                            <div className="text-xs text-gray-500 mt-1">{option.description}</div>
                          )}
                          {option.price && (
                            <div className="text-sm text-indigo-600 font-medium mt-1">Rs. {option.price}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : editMode === 'category' && availableCategories.length > 0 ? (
                    <div className="space-y-2 max-h-60 overflow-y-auto p-2">
                      {availableCategories.map(category => (
                        <div 
                          key={category.id}
                          onClick={() => handleOptionSelect(category)}
                          className={`p-3 border rounded-lg cursor-pointer transition-all ${
                            editingItem.categoryId === category.id
                              ? 'border-indigo-500 bg-indigo-50 transform scale-[1.02] shadow-md'
                              : 'border-gray-200 hover:bg-gray-50 hover:shadow-sm'
                          }`}
                        >
                          <div className="font-medium text-gray-800">{category.name}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            Select up to {category.limit} items
                          </div>
                          {category.description && (
                            <div className="text-xs text-gray-500 mt-1">{category.description}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : editMode === 'menuType' && availableMenuTypes.length > 0 ? (
                    <div className="space-y-2 max-h-60 overflow-y-auto p-2">
                      {availableMenuTypes.map(menuType => (
                        <div 
                          key={menuType.id}
                          onClick={() => handleOptionSelect(menuType)}
                          className={`p-3 border rounded-lg cursor-pointer transition-all ${
                            editingItem.menuTypeId === menuType.id
                              ? 'border-indigo-500 bg-indigo-50 transform scale-[1.02] shadow-md'
                              : 'border-gray-200 hover:bg-gray-50 hover:shadow-sm'
                          }`}
                        >
                          <div className="font-medium text-gray-800">{menuType.name}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            {menuType.description || 'No description available'}
                          </div>
                          <div className="text-sm text-indigo-600 font-medium mt-1">
                            Rs. {menuType.price}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : editMode === 'menuList' && availableMenuLists.length > 0 ? (
                    <div className="space-y-2 max-h-60 overflow-y-auto p-2">
                      {availableMenuLists.map(menuList => (
                        <div 
                          key={menuList.id}
                          onClick={() => handleOptionSelect(menuList)}
                          className={`p-3 border rounded-lg cursor-pointer transition-all ${
                            editingItem.menuListId === menuList.id
                              ? 'border-indigo-500 bg-indigo-50 transform scale-[1.02] shadow-md'
                              : 'border-gray-200 hover:bg-gray-50 hover:shadow-sm'
                          }`}
                        >
                          <div className="font-medium text-gray-800">{menuList.name}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            {menuList.description || 'No description available'}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {menuList.types?.length || 0} menu types available
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <h4 className="mt-2 text-sm font-medium text-gray-700">No options available</h4>
                      <p className="mt-1 text-xs text-gray-500">There are no {editMode} options to display</p>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={cancelEdit}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-200 flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                    Cancel
                  </button>
                  <button
                    onClick={saveEdit}
                    disabled={!editingItem.ICMT_Id && !editingItem.categoryId && !editingItem.menuTypeId && !editingItem.menuListId}
                    className={`px-6 py-2 rounded-lg font-medium text-white transition duration-200 flex items-center ${
                      (!editingItem.ICMT_Id && !editingItem.categoryId && !editingItem.menuTypeId && !editingItem.menuListId)
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-700'
                    }`}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {filteredCustomers.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No orders found</h3>
            <p className="mt-1 text-gray-500">
              {searchTerm ? "Try adjusting your search query" : "There are currently no menu orders to display"}
            </p>
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredCustomers.map((customer) => (
              <div key={customer.customer_id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                      <span className="text-indigo-600 font-medium">
                        {customer.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </span>
                    </div>
                    <div className="ml-4">
                      <h2 className="text-lg font-semibold text-gray-900">{customer.name}</h2>
                      <p className="text-sm text-gray-500">{customer.email}</p>
                    </div>
                  </div>
                </div>
                
                <div className="divide-y divide-gray-100">
                  {customer.bookings.map((booking) => (
                    <div key={booking.booking_id} className="p-6">
                      <div 
                        className="flex justify-between items-center cursor-pointer group"
                        onClick={() => toggleBookingDetails(booking.booking_id)}
                      >
                        <div>
                          <h3 className="text-base font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">
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
                        <div className="flex items-center">
                          <span className="text-sm text-gray-500 mr-2">
                            {booking.menus?.length || 0} menu type{booking.menus?.length !== 1 ? 's' : ''}
                          </span>
                          <svg
                            className={`w-5 h-5 text-gray-400 transform transition-transform ${expandedBooking === booking.booking_id ? 'rotate-180' : ''}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                      
                      {expandedBooking === booking.booking_id && (
                        <div className="mt-6 space-y-4">
                          {booking.menus?.map((menu) => (
                            <div key={menu.menu_type_id} className="bg-gray-50 rounded-lg p-5">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="text-lg font-semibold text-gray-900">
                                    {menu.menu_list_name}
                                  </h4>
                                  <p className="text-sm text-gray-500 mt-1">
                                    {menu.menu_type_name}
                                  </p>
                                </div>
                                <div className="flex items-center space-x-3">
                                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                    Rs. {menu.categories?.[0]?.items?.[0]?.price || '0.00'}
                                  </span>
                                  <button
                                    onClick={() => prepareMenuListChange(booking.booking_id, menu.menu_list_id)}
                                    className="text-xs text-indigo-600 hover:text-indigo-800"
                                  >
                                    Change
                                  </button>
                                </div>
                              </div>
                              
                              <div className="mt-4 space-y-4">
                                {menu.categories?.map((category) => (
                                  <div key={category.category_id} className="pl-4 border-l-2 border-indigo-200">
                                    <div className="flex justify-between items-center">
                                      <h5 className="text-sm font-medium text-gray-700">
                                        {category.category_name} 
                                        <span className="ml-2 text-xs font-normal text-gray-500">
                                          (Selected: {category.items?.length || 0}/{category.item_limit})
                                        </span>
                                      </h5>
                                      <button
                                        onClick={() => prepareCategoryChange(menu.menu_type_id, booking.booking_id, menu.menu_list_id, category.category_id)}
                                        className="text-xs text-indigo-600 hover:text-indigo-800"
                                      >
                                        Change
                                      </button>
                                    </div>
                                    
                                    {category.items?.length > 0 ? (
                                      <ul className="mt-2 space-y-1 ml-2">
                                        {category.items?.map((item) => (
                                          <li key={item.ICMT_Id} className="flex items-start justify-between group">
                                            <div className="flex items-start">
                                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-500 mt-0.5 mr-1.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                              </svg>
                                              <span className="text-sm text-gray-700">{item.item_name}</span>
                                            </div>
                                            <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                              <button
                                                onClick={() => startEdit(item, booking.booking_id, menu.menu_type_id, category.category_id, menu.menu_list_id)}
                                                className="text-indigo-600 hover:text-indigo-800 p-1"
                                                title="Change"
                                              >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                </svg>
                                              </button>
                                              <button
                                                onClick={() => handleDelete(booking.booking_id, item.ICMT_Id)}
                                                className="text-red-600 hover:text-red-800 p-1"
                                                title="Delete"
                                              >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                              </button>
                                            </div>
                                          </li>
                                        ))}
                                      </ul>
                                    ) : (
                                      <p className="text-xs text-gray-400 italic mt-1 ml-2">No items selected</p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMenuOrdersPage;