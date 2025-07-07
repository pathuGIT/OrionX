import React, { useState, useEffect } from "react";
import {
  getItemCategoryMenuTypes,
  addItemCategoryMenuType,
  getCategoryMenuTypes,
  getItems,
  deleteItemCategoryMenuType,
  updateItemCategoryMenuTypeById,
  getItemCategoryMenuTypeById
} from "../../services/MenuService";

function CreateItemCategoryMenuType() {
  const [itemCategoryMenu, setItemCategoryMenu] = useState({
    item_id: "",
    category_menu_type_id: ""
  });

  const [itemCategoryMenuTypes, setItemCategoryMenuTypes] = useState([]);
  const [categoryMenuTypes, setCategoryMenuTypes] = useState([]);
  const [items, setItems] = useState([]);
  const [btnName, setBtnName] = useState('Add Item Category Menu Type');
  const [selectedId, setSelectedId] = useState(null);
  const [isTableMaximized, setIsTableMaximized] = useState(false);

  // New filter states
  const [menuTypeFilter, setMenuTypeFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [icmts, cmts, its] = await Promise.all([
          getItemCategoryMenuTypes(),
          getCategoryMenuTypes(),
          getItems()
        ]);

        setItemCategoryMenuTypes(icmts);
        setCategoryMenuTypes(cmts);
        setItems(its);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

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

      const updated = await getItemCategoryMenuTypes();
      setItemCategoryMenuTypes(updated);
      setItemCategoryMenu({ item_id: "", category_menu_type_id: "" });

    } catch (error) {
      alert("Operation failed!");
      console.error(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItemCategoryMenu(prev => ({ ...prev, [name]: value }));
  };

  const handleEdit = async (icmtId) => {
    try {
      const data = await getItemCategoryMenuTypeById(icmtId);
      setItemCategoryMenu({
        item_id: data.item_id,
        category_menu_type_id: data.category_menu_type_id
      });
      setSelectedId(icmtId);
      setBtnName('Update');
    } catch (error) {
      console.error("Error fetching for edit:", error);
    }
  };

  const handleDelete = async (icmtId) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await deleteItemCategoryMenuType(icmtId);
      alert("Deleted successfully!");
      const updated = await getItemCategoryMenuTypes();
      setItemCategoryMenuTypes(updated);
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const getItemName = (itemId) =>
    items.find(i => i.item_id === itemId)?.item_name || itemId;

  const getCMTName = (cmtId) => {
    const match = categoryMenuTypes.find(c => c.category_menu_type_Id == cmtId);
    if (match) {
      return `${match.menu_type_name} - ${match.category_name}`;
    }
    return cmtId;
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
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Menu Type Associations</h1>
          <p className="text-gray-600 mt-2 max-w-3xl">
            Link menu items with category types to organize your menu structure
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Form Section */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-fit">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-5 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">
                  {btnName === 'Add Item Category Menu Type' ? 'Create New Association' : 'Update Association'}
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="p-5 space-y-5">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Menu Item</label>
                  <select
                    name="item_id"
                    required
                    value={itemCategoryMenu.item_id}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-300"
                  >
                    <option value="">Select menu item</option>
                    {items.map(item => (
                      <option key={item.item_id} value={item.item_id}>{item.item_name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category Menu Type</label>
                  <select
                    name="category_menu_type_id"
                    required
                    value={itemCategoryMenu.category_menu_type_id}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-300"
                  >
                    <option value="">Select category type</option>
                    {categoryMenuTypes.map(cmt => (
                      <option key={cmt.category_menu_type_Id} value={cmt.category_menu_type_Id}>
                        {`${cmt.menu_type_name} - ${cmt.category_name}`}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className={`w-full py-3 px-4 rounded-lg font-medium text-white transition duration-200 ${btnName === 'Add Item Category Menu Type'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                      : 'bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600'
                    }`}
                >
                  {btnName}
                </button>
              </form>
            </div>
          </div>

          {/* Table Section */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-[calc(100vh-180px)] flex flex-col">

              {/* Filters */}
              <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-wrap gap-4">
                <select
                  value={menuTypeFilter}
                  onChange={(e) => setMenuTypeFilter(e.target.value)}
                  className="px-4 py-2 rounded border text-sm"
                >
                  <option value="">All Menu Types</option>
                  {[...new Set(categoryMenuTypes.map(c => c.menu_type_name))].map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>

                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-4 py-2 rounded border text-sm"
                >
                  <option value="">All Categories</option>
                  {[...new Set(categoryMenuTypes.map(c => c.category_name))].map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Table Header */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-5 py-4 border-b border-gray-200 flex justify-between items-center">
                <div className="flex items-center">
                  <h2 className="text-lg font-semibold text-gray-800 mr-3">Current Associations</h2>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {filteredItemCategoryMenuTypes.length} associations
                  </span>
                </div>

                <button
                  onClick={() => setIsTableMaximized(true)}
                  className="text-sm text-blue-600 hover:text-blue-800 border border-blue-200 rounded-lg px-3 py-1.5"
                >
                  Maximize View
                </button>
              </div>

              {/* Table Body */}
              <div className="overflow-auto flex-grow">
                <table className="w-full min-w-max">
                  <thead className="sticky top-0 z-10 bg-gray-50 text-gray-500 text-sm">
                    <tr>
                      <th className="text-left py-3 px-4">ID</th>
                      <th className="text-left py-3 px-4">Category Type</th>
                      <th className="text-left py-3 px-4">Menu Item</th>
                      <th className="text-center py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredItemCategoryMenuTypes.map(icmt => (
                      <tr key={icmt.ICMT_Id} className="hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-900 text-sm">#{icmt.ICMT_Id}</td>
                        <td className="py-3 px-4 text-sm text-gray-800">{getCMTName(icmt.category_menu_type_id)}</td>
                        <td className="py-3 px-4 text-sm">{getItemName(icmt.item_id)}</td>
                        <td className="py-3 px-4 text-center space-x-2">
                          <button onClick={() => handleEdit(icmt.ICMT_Id)} className="text-blue-600 hover:underline text-sm">Edit</button>
                          <button onClick={() => handleDelete(icmt.ICMT_Id)} className="text-red-600 hover:underline text-sm">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredItemCategoryMenuTypes.length === 0 && (
                  <div className="text-center py-10 text-gray-500">No matching data found.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table Modal omitted for brevity, you can apply the same filtered list there too */}
      {/* Maximized Table Modal */}
      {isTableMaximized && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col">
            <div className="flex justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center">
                <h2 className="text-xl font-semibold text-gray-800 mr-4">
                  Association Details
                </h2>
                <span className="bg-blue-500 text-white text-sm font-medium px-3 py-1 rounded-full">
                  {itemCategoryMenuTypes.length} associations
                </span>
              </div>
              <button
                onClick={() => setIsTableMaximized(false)}
                className="text-gray-500 hover:text-gray-700 bg-white border border-gray-200 rounded-lg p-2 transition duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="overflow-auto flex-grow p-4">
              <table className="w-full min-w-max">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-gray-100 text-gray-600 text-sm">
                    <th className="text-left py-4 px-6 font-medium">ID</th>
                    <th className="text-left py-4 px-6 font-medium">Category Menu Type ID</th>
                    <th className="text-left py-4 px-6 font-medium">Category Type</th>
                    <th className="text-left py-4 px-6 font-medium">Item ID</th>
                    <th className="text-left py-4 px-6 font-medium">Menu Item</th>
                    <th className="text-center py-4 px-6 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {itemCategoryMenuTypes.map(icmt => (
                    <tr
                      key={icmt.ICMT_Id}
                      className="hover:bg-gray-50 transition duration-150 text-xs"
                    >
                      <td className="py-3 px-6 font-medium text-gray-900">
                        #{icmt.ICMT_Id}
                      </td>
                      <td className="py-3 px-6 text-gray-700">
                        {icmt.category_menu_type_id}
                      </td>
                      <td className="py-3 px-6">
                        <div className="text-gray-800 font-medium">
                          {getCMTName(icmt.category_menu_type_id)}
                        </div>
                      </td>
                      <td className="py-3 px-6 text-gray-700">
                        {icmt.item_id}
                      </td>
                      <td className="py-3 px-6">
                        <div className="flex items-center">
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-2">
                            Item
                          </span>
                          {getItemName(icmt.item_id)}
                        </div>
                      </td>
                      <td className="py-3 px-6">
                        <div className="flex justify-center space-x-3">
                          <button
                            onClick={() => {
                              setIsTableMaximized(false);
                              setTimeout(() => handleEdit(icmt.ICMT_Id), 100);
                            }}
                            className="px-4 py-2 bg-blue-50 border border-blue-100 text-blue-600 rounded-lg hover:bg-blue-100 transition duration-200 flex items-center"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(icmt.ICMT_Id)}
                            className="px-4 py-2 bg-red-50 border border-red-100 text-red-600 rounded-lg hover:bg-red-100 transition duration-200 flex items-center"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
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
          </div>
        </div>
      )}

    </div>
  );
}

export default CreateItemCategoryMenuType;
