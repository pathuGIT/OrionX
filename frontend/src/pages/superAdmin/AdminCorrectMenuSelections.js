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
      
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-700 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">Customer Menu Orders</h1>
            <p className="text-blue-100">View and manage all customer menu selections</p>
          </div>
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Search customers or bookings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full rounded-lg bg-blue-50 bg-opacity-20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-blue-200"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        <div className="p-6">
          {editingItem && (
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border border-blue-200 relative">
              <button 
                onClick={cancelEdit}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
              
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                {editMode === 'item' && 'Edit Menu Item'}
                {editMode === 'category' && 'Change Menu Category'}
                {editMode === 'menuType' && 'Change Menu Type'}
                {editMode === 'menuList' && 'Change Menu List'}
              </h2>
              
              <div className="mb-4 space-y-2 bg-blue-50 p-4 rounded-lg">
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-60 overflow-y-auto p-2">
                    {availableOptions.map(option => (
                      <div 
                        key={option.id}
                        onClick={() => handleOptionSelect(option)}
                        className={`p-3 border rounded-lg cursor-pointer transition-all ${
                          editingItem.ICMT_Id === option.id
                            ? 'border-blue-500 bg-blue-50 transform scale-[1.02] shadow-md'
                            : 'border-gray-200 hover:bg-gray-50 hover:shadow-sm'
                        }`}
                      >
                        <div className="font-medium text-gray-800">{option.name}</div>
                        <div className="text-xs text-gray-500 mt-1">{option.description || 'No description available'}</div>
                        {option.price && (
                          <div className="text-sm text-blue-600 font-medium mt-1">Rs. {option.price}</div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : editMode === 'category' && availableCategories.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-60 overflow-y-auto p-2">
                    {availableCategories.map(category => (
                      <div 
                        key={category.id}
                        onClick={() => handleOptionSelect(category)}
                        className={`p-3 border rounded-lg cursor-pointer transition-all ${
                          editingItem.categoryId === category.id
                            ? 'border-blue-500 bg-blue-50 transform scale-[1.02] shadow-md'
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-60 overflow-y-auto p-2">
                    {availableMenuTypes.map(menuType => (
                      <div 
                        key={menuType.id}
                        onClick={() => handleOptionSelect(menuType)}
                        className={`p-3 border rounded-lg cursor-pointer transition-all ${
                          editingItem.menuTypeId === menuType.id
                            ? 'border-blue-500 bg-blue-50 transform scale-[1.02] shadow-md'
                            : 'border-gray-200 hover:bg-gray-50 hover:shadow-sm'
                        }`}
                      >
                        <div className="font-medium text-gray-800">{menuType.name}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {menuType.description || 'No description available'}
                        </div>
                        <div className="text-sm text-blue-600 font-medium mt-1">
                          Rs. {menuType.price}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : editMode === 'menuList' && availableMenuLists.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-60 overflow-y-auto p-2">
                    {availableMenuLists.map(menuList => (
                      <div 
                        key={menuList.id}
                        onClick={() => handleOptionSelect(menuList)}
                        className={`p-3 border rounded-lg cursor-pointer transition-all ${
                          editingItem.menuListId === menuList.id
                            ? 'border-blue-500 bg-blue-50 transform scale-[1.02] shadow-md'
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
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {filteredCustomers.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No menu orders found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? "Try adjusting your search query" : "There are currently no menu orders to display"}
              </p>
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {filteredCustomers.map((customer) => (
                <div key={customer.customer_id} className="space-y-4">
                  <div className="flex justify-between items-center border-b pb-2">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 text-blue-800 rounded-full w-10 h-10 flex items-center justify-center font-bold">
                        {customer.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-800">
                          {customer.name}
                        </h2>
                        <p className="text-sm text-gray-500">{customer.email}</p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      {customer.bookings.length} booking{customer.bookings.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  
                  {customer.bookings.map((booking) => (
                    <div key={booking.booking_id} className="border rounded-lg overflow-hidden transition-all duration-200 hover:shadow-md">
                      <div 
                        className="p-4 bg-gray-50 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                        onClick={() => toggleBookingDetails(booking.booking_id)}
                      >
                        <div>
                          <h3 className="font-bold text-lg text-gray-800 flex items-center">
                            <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                            Booking for {format(new Date(booking.event_date || booking.booking_date), 'MMMM do, yyyy')}
                          </h3>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                            <p className="text-sm text-gray-600 flex items-center">
                              <svg className="w-3 h-3 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"></path>
                              </svg>
                              {booking.booking_id}
                            </p>
                            <p className="text-sm text-gray-600 flex items-center">
                              <svg className="w-3 h-3 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                              </svg>
                              {booking.number_of_guests} guest{booking.number_of_guests !== 1 ? 's' : ''}
                            </p>
                            <p className="text-sm text-gray-600 flex items-center">
                              <span className={`inline-block w-2 h-2 rounded-full mr-1 ${
                                booking.status === 'confirmed' ? 'bg-green-500' :
                                booking.status === 'pending' ? 'bg-yellow-500' :
                                'bg-gray-500'
                              }`}></span>
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </p>
                            <p className="text-sm text-gray-600 flex items-center">
                              <svg className="w-3 h-3 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                              </svg>
                              {booking.time_slot === 'day' ? 'Day' : 'Night'} event
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-gray-600 bg-blue-50 px-3 py-1 rounded-full">
                            {booking.menus?.length || 0} menu package{booking.menus?.length !== 1 ? 's' : ''}
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
                        <div className="p-4 border-t bg-white">
                          <div className="space-y-6">
                            {booking.menus?.map((menu) => (
                              <div key={menu.menu_type_id} className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow duration-200">
                                <div className="flex justify-between items-center mb-3">
                                  <div className="flex items-center">
                                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                                    <h4 className="font-semibold text-lg text-gray-800">
                                      {menu.menu_list_name} - {menu.menu_type_name}
                                    </h4>
                                  </div>
                                  <div className="flex space-x-3">
                                    <span className="text-lg font-bold text-blue-600">
                                      Rs. {menu.categories?.[0]?.items?.[0]?.price || '0.00'}
                                    </span>
                                    <div className="relative group">
                                      <button className="text-xs text-blue-600 hover:text-blue-800">
                                        Actions
                                      </button>
                                      <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                                        <button
                                          onClick={() => prepareMenuListChange(booking.booking_id, menu.menu_list_id)}
                                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                        >
                                          Change Menu List
                                        </button>
                                        <button
                                          onClick={() => prepareMenuTypeChange(menu.menu_list_id, booking.booking_id, menu.menu_type_id)}
                                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                        >
                                          Change Menu Type
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="ml-6 space-y-4">
                                  {menu.categories?.map((category) => (
                                    <div key={category.category_id} className="border-l-2 border-blue-200 pl-4 relative group">
                                      <div className="absolute -left-2 top-3 w-4 h-4 bg-blue-500 rounded-full"></div>
                                      <div className="flex justify-between items-center mb-2">
                                        <h5 className="font-medium text-gray-700">
                                          {category.category_name} ({category.items?.length || 0} of {category.item_limit} selected)
                                        </h5>
                                        <div className="flex space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                          <button
                                            onClick={() => prepareCategoryChange(menu.menu_type_id, booking.booking_id, menu.menu_list_id, category.category_id)}
                                            className="text-xs text-blue-600 hover:text-blue-800"
                                          >
                                            Change Category
                                          </button>
                                          {category.items?.length > 0 && (
                                            <button
                                              onClick={() => {
                                                const firstItem = category.items[0];
                                                startEdit(firstItem, booking.booking_id, menu.menu_type_id, category.category_id, menu.menu_list_id);
                                              }}
                                              className="text-xs text-blue-600 hover:text-blue-800"
                                            >
                                              Change Items
                                            </button>
                                          )}
                                        </div>
                                      </div>
                                      
                                      <ul className="space-y-2 ml-4">
                                        {category.items?.map((item) => (
                                          <li key={item.ICMT_Id} className="group flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                                            <div>
                                              <p className="font-medium text-gray-800">{item.item_name}</p>
                                              {item.description && (
                                                <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                                              )}
                                            </div>
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
                                              <button
                                                onClick={() => startEdit(item, booking.booking_id, menu.menu_type_id, category.category_id, menu.menu_list_id)}
                                                className="text-blue-600 hover:text-blue-800 p-1"
                                                title="Edit"
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