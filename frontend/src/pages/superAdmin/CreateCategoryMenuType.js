import React, { useState, useEffect } from 'react';
import { getCategoryMenuTypes, addCategoryMenuType, getMenuTypes, getCategories } from '../../services/MenuService';

function CreateCategoryMenuType() {
  const [categoryMenu, setCategoryMenu] = useState({
    menu_type_id: '',
    category_id: '',
    item_limit: '',
  });

  const [categoryMenuTypes, setCategoryMenuTypes] = useState([]);
  const [categories, setCategories] = useState([]); 
  const [menuTypes, setMenuTypes] = useState([]); 

  useEffect(() => {
    const fetchCategoriesAndMenuTypes = async () => {
      try {
        const fetchedCategoryMenuTypes = await getCategoryMenuTypes();
        setCategoryMenuTypes(fetchedCategoryMenuTypes);

        const fetchedCategories = await getCategories();
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
      setCategoryMenuTypes(updatedCategories);
    } catch (error) {
      alert('An error occurred while adding the category menu type.');
      console.error(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "item_limit") {
      if (!/^\d*$/.test(value)) return; // Allow only digits
      if (value !== "" && parseInt(value, 10) <= 0) return; // Prevent negative values or zero
    }

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
                  {menuType.menu_type_name}
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
                  {category.category_name}
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
              min="1"
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
              <th className="border px-4 py-2">Menu Type Name</th>
              <th className="border px-4 py-2">Category Name</th>
              <th className="border px-4 py-2">Item Limit</th>
            </tr>
          </thead>
          <tbody>
            {categoryMenuTypes.map((cmt, index) => (
              <tr key={index} className="border">
                <td className="border px-4 py-2">{cmt.menu_type_name}</td>
                <td className="border px-4 py-2">{cmt.category_name}</td>
                <td className="border px-4 py-2">{cmt.item_limit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CreateCategoryMenuType;
