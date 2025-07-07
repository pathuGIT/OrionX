import React, { useState, useEffect } from 'react';
import {
  getItemCategoryMenuTypes,
  getCategoryMenuTypes,
  getItems,
  addItemCategoryMenuType,
  deleteItemCategoryMenuType,
  updateItemCategoryMenuTypeById,
  getItemCategoryMenuTypeById
} from '../../services/MenuService';

function CreateItemCategoryMenuType({setRenderContent}) {
  const [itemCategoryMenu, setItemCategoryMenu] = useState({
    item_id: '',
    category_menu_type_id: ''
  });

  const [itemCategoryMenuTypes, setItemCategoryMenuTypes] = useState([]);
  const [categoryMenuTypes, setCategoryMenuTypes] = useState([]);
  const [items, setItems] = useState([]);
  const [btnName, setBtnName] = useState('Add Item Category Menu Type');
  const [selectedId, setSelectedId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [icmtsResponse, cmtsResponse, itemsResponse] = await Promise.all([
          getItemCategoryMenuTypes(),
          getCategoryMenuTypes(),
          getItems()
        ]);
        
        setItemCategoryMenuTypes(icmtsResponse.data || []);
        setCategoryMenuTypes(cmtsResponse.data || []);
        setItems(itemsResponse.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItemCategoryMenu(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (btnName === 'Add Item Category Menu Type') {
        await addItemCategoryMenuType(itemCategoryMenu);
        alert("Added successfully!");
      } else {
        await updateItemCategoryMenuTypeById(selectedId, itemCategoryMenu);
        alert("Updated successfully!");
        setBtnName('Add Item Category Menu Type');
        setSelectedId(null);
      }

      const updatedResponse = await getItemCategoryMenuTypes();
      setItemCategoryMenuTypes(updatedResponse.data || []);
      setItemCategoryMenu({ item_id: "", category_menu_type_id: "" });
      setIsAdding(false);
    } catch (error) {
      alert("Operation failed!");
      console.error(error);
    }
  };

  const handleEdit = async (icmtId) => {
    try {
      const response = await getItemCategoryMenuTypeById(icmtId);
      const data = response.data;
      setItemCategoryMenu({
        item_id: data.item_id,
        category_menu_type_id: data.category_menu_type_id
      });
      setSelectedId(icmtId);
      setBtnName('Update');
      setIsAdding(true);
    } catch (error) {
      console.error("Error fetching for edit:", error);
    }
  };

  const handleDelete = async (icmtId) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await deleteItemCategoryMenuType(icmtId);
      alert("Deleted successfully!");
      const updatedResponse = await getItemCategoryMenuTypes();
      setItemCategoryMenuTypes(updatedResponse.data || []);
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const getItemName = (itemId) => {
    const item = items.find(i => i.item_id === itemId);
    return item ? item.item_name : `Item ${itemId}`;
  };
  
  const getCMTName = (cmtId) => {
    const cmt = categoryMenuTypes.find(c => c.category_menu_type_id === cmtId);
    return cmt ? `${cmt.menu_type_name || cmt.name} - ${cmt.category_name}` : `Category ${cmtId}`;
  };

  // Filtered Data
  const filteredItemCategoryMenuTypes = itemCategoryMenuTypes.filter(icmt => {
    const cmt = categoryMenuTypes.find(c => c.category_menu_type_Id == icmt.category_menu_type_id);
    if (!cmt) return false;

    const menuMatch = menuTypeFilter ? cmt.menu_type_name === menuTypeFilter : true;
    const categoryMatch = categoryFilter ? cmt.category_name === categoryFilter : true;

    return menuMatch && categoryMatch;
  });
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Item Category Menu Type Management</h1>
              <p className="text-gray-600">Link items with category menu types</p>
            </div>
          </div>
          {!isAdding && (
            <button
              onClick={() => setIsAdding(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition duration-200 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add New Mapping
            </button>
          )}
        </div>

        {isAdding && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8 transition-all duration-300">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                {btnName === 'Add Item Category Menu Type' ? 'Create New Mapping' : 'Update Mapping'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Item</label>
                  <select
                    name="item_id"
                    required
                    value={itemCategoryMenu.item_id}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  >
                    <option value="">Select Item</option>
                    {items.map(item => (
                      <option key={item.item_id} value={item.item_id}>
                        {item.item_name || item.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category Menu Type</label>
                  <select
                    name="category_menu_type_id"
                    required
                    value={itemCategoryMenu.category_menu_type_id}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  >
                    <option value="">Select Category Menu Type</option>
                    {categoryMenuTypes.map(cmt => (
                      <option key={cmt.category_menu_type_id} value={cmt.category_menu_type_id}>
                        {`${cmt.menu_type_name || cmt.name} - ${cmt.category_name}`}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAdding(false);
                      setBtnName('Add Item Category Menu Type');
                      setItemCategoryMenu({ item_id: "", category_menu_type_id: "" });
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`px-6 py-2 rounded-lg font-medium text-white transition duration-200 ${
                      btnName === 'Add Item Category Menu Type' 
                        ? 'bg-blue-600 hover:bg-blue-700' 
                        : 'bg-green-600 hover:bg-green-700'
                    }`}
                  >
                    {btnName}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Current Mappings</h2>
          </div>
          {itemCategoryMenuTypes.length === 0 ? (
            <div className="text-center py-12">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No mappings available</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating your first mapping</p>
              <button
                onClick={() => setIsAdding(true)}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition duration-200"
              >
                Add Mapping
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Menu Type - Category
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Item
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {itemCategoryMenuTypes.map((icmt) => (
                    <tr key={icmt.icmt_id} className="hover:bg-gray-50 transition duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{getCMTName(icmt.category_menu_type_id)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-6">
                        <div className="flex items-center">
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-2">
                            Item
                          </span>
                          {getItemName(icmt.item_id)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleEdit(icmt.icmt_id)}
                          className="text-blue-600 hover:text-blue-900 px-3 py-1 rounded-md bg-blue-50 hover:bg-blue-100 transition duration-200 flex items-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(icmt.icmt_id)}
                          className="text-red-600 hover:text-red-900 px-3 py-1 rounded-md bg-red-50 hover:bg-red-100 transition duration-200 flex items-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan="3" className="px-6 py-4 text-center">
                      <button
                        onClick={() => setIsAdding(true)}
                        className="text-blue-600 hover:text-blue-800 font-medium flex items-center justify-center w-full py-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Add New Mapping
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>

              {itemCategoryMenuTypes.length === 0 && (
                <div className="text-center py-16">
                  <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl w-20 h-20 mx-auto flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium text-gray-700 mb-2">No associations found</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    Create your first item-category association using the form
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

    </div>
  );
}

export default CreateItemCategoryMenuType;
