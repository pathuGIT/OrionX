import React, { useEffect, useState } from 'react';
import { getMenus } from '../../services/MenuService';

const GetMenus = () => {
  const [menus, setMenus] = useState([]);
  const [showDeletePrompt, setShowDeletePrompt] = useState(false);
  const [menuToDelete, setMenuToDelete] = useState(null);

  useEffect(() => {
    callGetMenus();
  }, []);

  const callGetMenus = async () => {
    const response = await getMenus();
    console.log("API Response:", response);
    setMenus(response);
  };

  const handleEditClick = (menu) => {
    // Edit logic here
    console.log("Edit Menu:", menu);
  };

  const handleDeleteClick = (menu) => {
    // Show delete confirmation prompt
    setShowDeletePrompt(true);
    setMenuToDelete(menu); // Set the menu to delete
  };

  const confirmDelete = () => {
    // Delete the menu
    console.log("Menu deleted:", menuToDelete);
    setMenus(menus.filter((menu) => menu.menu_list_type_id !== menuToDelete.menu_list_type_id));
    setShowDeletePrompt(false); // Hide the delete prompt
  };

  const cancelDelete = () => {
    setShowDeletePrompt(false); // Close the delete prompt without doing anything
  };

  return (
    <div>
      <h1 className="text-4xl font-bold text-center text-black mt-6 mb-4">Deandra Menus</h1>

      {menus.map((menu) => (
        <ul key={menu.menu_list_type_id} className="space-y-4">
          <li className="bg-blue-200 text-white p-6 rounded-lg shadow-lg hover:bg-blue-300 transition-all duration-300 aspect-w-1 aspect-h-1 flex justify-between items-center">
            <button className="text-left font-semibold">{menu.menu_list_name}</button>
            <div className="flex space-x-2">
              <button
                className="bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-all duration-200 w-full"
                onClick={() => handleEditClick(menu)}
              >
                Edit
              </button>
              <button
                className="bg-white text-black py-2 px-4 rounded-lg border border-black hover:bg-gray-200 transition-all duration-200 w-full"
                onClick={() => handleDeleteClick(menu)}
              >
                Delete
              </button>
            </div>
          </li>
        </ul>
      ))}

      {showDeletePrompt && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-xl font-semibold mb-4">Are you sure you want to delete this menu?</h2>
            <div className="flex space-x-4">
              <button
                className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-all duration-200"
                onClick={confirmDelete}
              >
                Delete
              </button>
              <button
                className="bg-gray-300 text-black py-2 px-4 rounded-lg hover:bg-gray-500 transition-all duration-200"
                onClick={cancelDelete}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GetMenus;
