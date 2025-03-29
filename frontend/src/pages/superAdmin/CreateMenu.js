import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addMenuListType, getMenus } from '../../services/MenuService';

function CreateMenu() {
  const [menu, setMenu] = useState({ menu_list_type_id: '', menu_list_name: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMenuListTypeId = async () => {
      try {
        const menus = await getMenus();
        // Format the ID as MLT000001, MLT000002, etc.
        const nextId = menus.length ? `MLT${(menus.length + 1).toString().padStart(6, '0')}` : 'MLT000001';
        setMenu((prevMenu) => ({ ...prevMenu, menu_list_type_id: nextId }));
      } catch (error) {
        console.error('Error fetching menu list type ID:', error);
      }
    };
    fetchMenuListTypeId();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { message } = await addMenuListType(menu);
      alert(message);
      setMenu({ menu_list_type_id: '', menu_list_name: '' });
    } catch (error) {
      console.error('Adding Error:', error);
      alert('An error occurred while adding the menu list type.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMenu((prevMenu) => ({ ...prevMenu, [name]: value }));
  };

  // Back and Next button handlers
  const handleBack = () => {
    navigate(-1); // Goes to the previous page
  };

  const handleNext = () => {
    navigate('/nextPage'); // Change '/nextPage' to the path you want to navigate to
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <div className="text-xl font-semibold text-black py-2 px-4 rounded-lg text-center mb-5">
        Create Menu
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md">
        <div>
          <label className="block text-sm font-medium text-gray-900">Menu List Type ID</label>
          <input
            type="text"
            name="menu_list_type_id"
            value={menu.menu_list_type_id}
            readOnly
            className="block w-full rounded-md bg-gray-200 px-3 py-2 text-gray-900"
          />
        </div>

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

        {/* Back and Next buttons below Add Menu */}
        <div className="flex mt-4 space-x-4">
          <button
            onClick={handleBack}
            className="w-1/3 bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            className="w-1/3 bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600"
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateMenu;
