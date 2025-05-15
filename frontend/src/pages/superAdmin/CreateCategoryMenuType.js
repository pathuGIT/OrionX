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
        const fetchedCategoryMenuTypes = await getCategoryMenuTypes();
        const fetchedCategories = await getCategories();
        const fetchedMenuTypes = await getMenuTypes();

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
    <div className="flex justify-between items-start mt-10 px-10 gap-2">
      {/* Left Panel - Form */}
      <div className="w-1/2 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-sm font-semibold text-black mb-5">Create Category Menu Type</h2>
        <form onSubmit={handleSubmit}>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-900">Menu Type</label>
            <select
              name="menu_type_id"
              required
              value={categoryMenu.menu_type_id}
              onChange={handleChange}
              className="block w-full rounded-md bg-white px-3 py-2 text-gray-900 border border-gray-300 focus:border-gray-500 focus:outline-none"
            >
              <option value="">Select Menu Type</option>
              {menuTypes.map((m) => (
                <option key={m.menu_type_id} value={m.menu_type_id}>
                  {m.menu_type_name}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-900">Category</label>
            <select
              name="category_id"
              required
              value={categoryMenu.category_id}
              onChange={handleChange}
              className="block w-full rounded-md bg-white px-3 py-2 text-gray-900 border border-gray-300 focus:border-gray-500 focus:outline-none"
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c.category_id} value={c.category_id}>
                  {c.category_name}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-900">Item Limit</label>
            <input
              type="number"
              name="item_limit"
              required
              placeholder="Enter item limit"
              value={categoryMenu.item_limit}
              onChange={handleChange}
              min="1"
              className="block w-full rounded-md bg-white px-3 py-2 text-gray-900 border border-gray-300 focus:border-gray-500 focus:outline-none"
            />
          </div>

          <button type="submit" className="w-full bg-gray-500 text-white py-2 mt-4 rounded-lg hover:bg-gray-600">
            {btnName}
          </button>
        </form>
      </div>

      {/* Right Panel - Table */}
      <div className="w-1/2 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-sm font-semibold text-black mb-5">Category Menu Types</h2>
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2 text-sm">Menu Type</th>
              <th className="border px-4 py-2 text-sm">Category</th>
              <th className="border px-4 py-2 text-sm">Item Limit</th>
              <th colSpan={2}>Action</th>
            </tr>
          </thead>
          <tbody>
            {categoryMenuTypes.map((cmt, index) => (
              <tr key={index}>
                <td className="border px-4 py-2 text-sm">{cmt.menu_type_name}</td>
                <td className="border px-4 py-2 text-sm">{cmt.category_name}</td>
                <td className="border px-4 py-2 text-sm">{cmt.item_limit}</td>
                <td>
                  <button
                    className="border px-3 py-1 bg-blue-500 text-sm text-white rounded"
                    onClick={() => handleEdit(cmt.menu_type_id, cmt.category_id)}
                  >
                    Edit
                  </button>
                </td>
                <td>
                  <button
                    className="border px-3 py-1 bg-red-500 text-sm text-white rounded"
                    onClick={() => handleDelete(cmt.menu_type_id, cmt.category_id)}
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
  );
}

export default CreateCategoryMenuType;
