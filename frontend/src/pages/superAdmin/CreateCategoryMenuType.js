import React, { useState, useEffect } from 'react';
import {
  getCategoryMenuTypes,
  addCategoryMenuType,
  getMenuTypes,
  getCategories,
  deleteCategoryMenuType,
  updateCategoryMenuType,
  getCategoryMenuTypeById,
} from '../../services/MenuService';

function CreateCategoryMenuType() {
  const [categoryMenu, setCategoryMenu] = useState({
    menu_type_id: '',
    category_id: '',
    item_limit: '',
  });

  const [categoryMenuTypes, setCategoryMenuTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [menuTypes, setMenuTypes] = useState([]);
  const [btnName, setBtnName] = useState('Add Category Menu Type');
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedCategoryMenuTypes, fetchedCategories, fetchedMenuTypes] = await Promise.all([
          getCategoryMenuTypes(),
          getCategories(),
          getMenuTypes()
        ]);

        setCategoryMenuTypes(fetchedCategoryMenuTypes);
        setCategories(fetchedCategories);
        setMenuTypes(fetchedMenuTypes);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'item_limit') {
      if (!/^\d*$/.test(value)) return;
      if (value !== '' && parseInt(value, 10) <= 0) return;
    }

    setCategoryMenu((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (btnName === 'Add Category Menu Type') {
        await addCategoryMenuType(categoryMenu);
        alert('Category Menu Type added successfully!');
      } else {
        await updateCategoryMenuType(selectedId, categoryMenu);
        alert('Category Menu Type updated successfully!');
        setBtnName('Add Category Menu Type');
        setSelectedId(null);
      }

      setCategoryMenu({ menu_type_id: '', category_id: '', item_limit: '' });
      const updated = await getCategoryMenuTypes();
      setCategoryMenuTypes(updated);
    } catch (error) {
      console.error('Error saving Category Menu Type:', error);
      alert('An error occurred while processing.');
    }
  };

  const handleEdit = async (menu_type_id, category_id) => {
    try {
      const result = await getCategoryMenuTypeById(menu_type_id, category_id);
      setCategoryMenu({
        menu_type_id: result.menu_type_id,
        category_id: result.category_id,
        item_limit: result.item_limit,
      });
      setSelectedId({ menu_type_id, category_id });
      setBtnName('Update');
    } catch (error) {
      console.error('Error loading data for edit:', error);
    }
  };

  const handleDelete = async (menu_type_id, category_id) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this menu?');
    if (!isConfirmed) return;
    try {
      await deleteCategoryMenuType(menu_type_id, category_id);
      alert('Deleted successfully!');
      const updated = await getCategoryMenuTypes();
      setCategoryMenuTypes(updated);
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Category Menu Type Management</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form Section */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
            <div className="border-b border-gray-200 pb-4 mb-6">
              <h2 className="text-lg font-semibold text-gray-800">Create Category Menu Type</h2>
              <p className="text-sm text-gray-500">Link menu types with categories and set limits</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Menu Type</label>
                <select
                  name="menu_type_id"
                  required
                  value={categoryMenu.menu_type_id}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                >
                  <option value="">Select Menu Type</option>
                  {menuTypes.map((m) => (
                    <option key={m.menu_type_id} value={m.menu_type_id}>
                      {m.menu_type_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  name="category_id"
                  required
                  value={categoryMenu.category_id}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c.category_id} value={c.category_id}>
                      {c.category_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Item Limit</label>
                <input
                  type="number"
                  name="item_limit"
                  required
                  placeholder="Enter item limit"
                  value={categoryMenu.item_limit}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                />
              </div>

              <button
                type="submit"
                className={`w-full py-2 px-4 rounded-lg font-medium text-white transition duration-200 ${
                  btnName === 'Add Category Menu Type' 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {btnName}
              </button>
            </form>
          </div>

          {/* Table Section */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
            <div className="border-b border-gray-200 pb-4 mb-6">
              <h2 className="text-lg font-semibold text-gray-800">Category Menu Types</h2>
              <p className="text-sm text-gray-500">Current category and menu type associations</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Menu Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Item Limit
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {categoryMenuTypes.map((cmt, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {cmt.menu_type_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {cmt.category_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {cmt.item_limit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleEdit(cmt.menu_type_id, cmt.category_id)}
                          className="text-blue-600 hover:text-blue-900 px-3 py-1 rounded-md bg-blue-50 hover:bg-blue-100 transition duration-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(cmt.menu_type_id, cmt.category_id)}
                          className="text-red-600 hover:text-red-900 px-3 py-1 rounded-md bg-red-50 hover:bg-red-100 transition duration-200"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateCategoryMenuType;