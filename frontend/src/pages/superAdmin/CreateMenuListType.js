import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addMenuListType, getMenus } from '../../services/MenuService';

function CreateMenuListType() {
  const [menu, setMenu] = useState({ menu_list_type_id: '', menu_list_name: '' });
  const [menus, setMenus] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const fetchedMenus = await getMenus();
        setMenus(fetchedMenus);
        const nextId = fetchedMenus.length ? `MLT${(fetchedMenus.length + 1).toString().padStart(6, '0')}` : 'MLT000001';
        setMenu((prevMenu) => ({ ...prevMenu, menu_list_type_id: nextId }));
      } catch (error) {
        console.error('Error fetching menu list types:', error);
      }
    };
    fetchMenus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addMenuListType(menu);
      alert('Menu added successfully!');
      setMenu({menu_list_name: '' });
      
      // Refresh menu list after adding
      const updatedMenus = await getMenus();
      setMenus(updatedMenus);
    } catch (error) {
      console.error('Adding Error:', error);
      alert('An error occurred while adding the menu list type.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMenu((prevMenu) => ({ ...prevMenu, [name]: value }));
  };

  return (
    <div className="flex justify-between items-start mt-10 px-10">
      {/* Left Side - Form */}
      <div className="w-1/2 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-black mb-5">Create Menu</h2>
        <form onSubmit={handleSubmit}>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-900">Menu List Name</label>
            <input
              type="text"
              name="menu_list_name"
              required
              placeholder="Enter menu list name"
              value={menu.menu_list_name}
              onChange={handleChange}
              className="block w-full rounded-md bg-white px-3 py-2 text-gray-900 border border-gray-300 focus:border-gray-500 focus:outline-none"
            />
          </div>
          <button type="submit" className="w-full bg-gray-500 text-white py-2 mt-4 rounded-lg hover:bg-gray-600">
            Add Menu
          </button>
        </form>
      </div>
      
      {/* Right Side - Table */}
      <div className="w-1/2 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-black mb-5">Menu List Types</h2>
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">Name</th>
            </tr>
          </thead>
          <tbody>
            {menus.map((menuItem, index) => (
              <tr key={index} className="border">
                <td className="border px-4 py-2">{menuItem.menu_list_type_id}</td>
                <td className="border px-4 py-2">{menuItem.menu_list_name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CreateMenuListType;