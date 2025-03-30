import React, { useState, useEffect } from 'react';
import { getMenuTypes, addMenuType, getMenus } from '../../services/MenuService'; // Added getMenus

function CreateMenuType() {
  const [menuType, setMenuType] = useState({ menu_type_id: '', menu_type_name: '', price: '', menu_list_type_id: '' });
  const [menuTypes, setMenuTypes] = useState([]);
  const [menuListTypes, setMenuListTypes] = useState([]); // State for menu list types

  useEffect(() => {
    const fetchMenuTypes = async () => {
      try {
        const fetchedMenuTypes = await getMenuTypes();
        setMenuTypes(fetchedMenuTypes);
        const nextId = fetchedMenuTypes.length ? `MT${(fetchedMenuTypes.length + 1).toString().padStart(6, '0')}` : 'MT000001';
        setMenuType((prev) => ({ ...prev, menu_type_id: nextId }));
      } catch (error) {
        console.error('Error fetching menu types:', error);
      }
    };

    const fetchMenuListTypes = async () => {
      try {
        const fetchedMenuListTypes = await getMenus(); // Fetch menu list types
        setMenuListTypes(fetchedMenuListTypes);
      } catch (error) {
        console.error('Error fetching menu list types:', error);
      }
    };

    fetchMenuTypes();
    fetchMenuListTypes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addMenuType(menuType);
      alert('Menu Type added successfully!');
      setMenuType({ menu_type_name: '', price: '', menu_list_type_id: '' });

      // Refresh menu types after adding
      const updatedMenuTypes = await getMenuTypes();
      setMenuTypes(updatedMenuTypes);
    } catch (error) {
      console.error('Adding Error:', error);
      alert('An error occurred while adding the menu type.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMenuType((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex justify-between items-start mt-10 px-10">
      {/* Left Side - Form */}
      <div className="w-1/2 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-black mb-5">Create Menu Type</h2>
        <form onSubmit={handleSubmit}>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-900">Menu Type Name</label>
            <input
              type="text"
              name="menu_type_name"
              required
              placeholder="Enter menu type name"
              value={menuType.menu_type_name}
              onChange={handleChange}
              className="block w-full rounded-md bg-white px-3 py-2 border border-gray-300 focus:border-gray-500 focus:outline-none"
            />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-900">Price</label>
            <input
              type="number"
              name="price"
              required
              placeholder="Enter price"
              value={menuType.price}
              onChange={handleChange}
              className="block w-full rounded-md bg-white px-3 py-2 border border-gray-300 focus:border-gray-500 focus:outline-none"
            />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-900">Select Menu List Type</label>
            <select
              name="menu_list_type_id"
              required
              value={menuType.menu_list_type_id}
              onChange={handleChange}
              className="block w-full rounded-md bg-white px-3 py-2 border border-gray-300 focus:border-gray-500 focus:outline-none"
            >
              <option value="" disabled>Select a menu list type</option>
              {menuListTypes.map((menuListType) => (
                <option key={menuListType.menu_list_type_id} value={menuListType.menu_list_type_id}>
                  {menuListType.menu_list_name}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="w-full bg-gray-500 text-white py-2 mt-4 rounded-lg hover:bg-gray-600">
            Add Menu Type
          </button>
        </form>
      </div>

      {/* Right Side - Table */}
      <div className="w-1/2 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-black mb-5">Menu Types</h2>
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Price</th>
            </tr>
          </thead>
          <tbody>
            {menuTypes.map((type, index) => (
              <tr key={index} className="border">
                <td className="border px-4 py-2">{type.menu_type_id}</td>
                <td className="border px-4 py-2">{type.menu_type_name}</td>
                <td className="border px-4 py-2">${type.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CreateMenuType;