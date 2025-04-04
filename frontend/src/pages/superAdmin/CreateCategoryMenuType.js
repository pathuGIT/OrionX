import React, { useState, useEffect } from 'react';
import { getCategoryMenuTypes, addCategoryMenuType, getMenuTypes } from '../../services/MenuService';

function CreateCategoryMenuType() {
  const [categoryMenu, setCategoryMenu] = useState({
    menu_type_id: '',
    category_id: '',
    item_limit: '',
  });

  const [categories, setCategories] = useState([]);
  const [menuTypes, setMenuTypes] = useState([]); // For storing the menu types

  useEffect(() => {
    const fetchCategoriesAndMenuTypes = async () => {
      try {
        // Fetch all categories and menu types
        const fetchedCategories = await getCategoryMenuTypes();
        const fetchedMenuTypes = await getMenuTypes();
        setCategories(fetchedCategories);
        setMenuTypes(fetchedMenuTypes);
      } catch (error) {
        console.error('Error fetching categories and menu types:', error);
      }
    };
    fetchCategoriesAndMenuTypes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Submitting:", categoryMenu);
      await addCategoryMenuType(categoryMenu);
      alert('Category Menu Type added successfully!');
      setCategoryMenu({ menu_type_id: '', category_id: '', item_limit: '' });

      // Refresh categories after adding
      const updatedCategories = await getCategoryMenuTypes();
      setCategories(updatedCategories);
    } catch (error) {
      alert('An error occurred while adding the category menu type.');
      console.error(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategoryMenu((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex justify-between items-start mt-10 px-10">
      {/* Left Side - Form */}
      <div className="w-1/2 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-black mb-5">Category Menu Type</h2>
        <form onSubmit={handleSubmit}>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-900">Menu Type</label>
            <select
              name="menu_type_id"
              required
              value={categoryMenu.menu_type_id}
              onChange={handleChange}
              className="block w-full rounded-md bg-white px-3 py-2 border border-gray-300 focus:border-gray-500 focus:outline-none"
            >
              <option value="">Select Menu Type</option>
              {menuTypes.map((menuType) => (
                <option key={menuType.menu_type_id} value={menuType.menu_type_id}>
                  {menuType.menu_type_name} {/* Displaying the name of the menu type */}
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
              className="block w-full rounded-md bg-white px-3 py-2 border border-gray-300 focus:border-gray-500 focus:outline-none"
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.category_id} value={category.category_id}>
                  {category.category_name} {/* Displaying the name of the category */}
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
              placeholder="Enter Item Limit"
              value={categoryMenu.item_limit}
              onChange={handleChange}
              className="block w-full rounded-md bg-white px-3 py-2 border border-gray-300 focus:border-gray-500 focus:outline-none"
            />
          </div>

          <button type="submit" className="w-full bg-gray-500 text-white py-2 mt-4 rounded-lg hover:bg-gray-600">
            Add Category Menu Type
          </button>
        </form>
      </div>
      
      {/* Right Side - Table */}
      <div className="w-1/2 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-black mb-5">Category Menu Types</h2>
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Menu Type ID</th>
              <th className="border px-4 py-2">Category Name</th> {/* Change category_id to category_name */}
              <th className="border px-4 py-2">Item Limit</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category, index) => (
              <tr key={index} className="border">
                <td className="border px-4 py-2">{category.menu_type_id}</td>
                <td className="border px-4 py-2">{category.category_name}</td> {/* Displaying the category name */}
                <td className="border px-4 py-2">{category.item_limit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CreateCategoryMenuType;
