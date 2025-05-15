import React, { useState, useEffect } from 'react';
import { getMenuTypes, addMenuType, getMenus, deleteMenuType, updateMenuTypeById, getMenuTypeById } from '../../services/MenuService';

function CreateMenuType() {
  // Initialize state for a single menu type, list of all menu types, and menu list types
  const [menuType, setMenuType] = useState({ menu_type_id: '', menu_type_name: '', price: '', menu_list_type_id: '' });
  const [menuTypes, setMenuTypes] = useState([]);
  const [menuListTypes, setMenuListTypes] = useState([]);
  const [btnname, setBtnname] = useState('Add Menu Type');

  // Fetch menu types and menu list types when component mounts
  useEffect(() => {
    const fetchMenuTypes = async () => {
      try {
        const fetchedMenuTypes = await getMenuTypes();
        setMenuTypes(fetchedMenuTypes);

        // Generate the next menu type ID (e.g., MT000002)
        const nextId = fetchedMenuTypes.length ? `MT${(fetchedMenuTypes.length + 1).toString().padStart(6, '0')}` : 'MT000001';
        setMenuType((prev) => ({ ...prev, menu_type_id: nextId }));
      } catch (error) {
        console.error('Error fetching menu types:', error);
      }
    };

    const fetchMenuListTypes = async () => {
      try {
        const fetchedMenuListTypes = await getMenus();
        setMenuListTypes(fetchedMenuListTypes);
      } catch (error) {
        console.error('Error fetching menu list types:', error);
      }
    };

    fetchMenuTypes();
    fetchMenuListTypes();
  }, []);

  // Handle form submission to add or update a menu type
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Trim name to remove leading/trailing spaces
    const trimmedName = menuType.menu_type_name.trim();

    // Validation checks
    if (!trimmedName) {
      alert("Menu Type Name cannot be empty or contain only spaces!");
      return;
    }

    if (!menuType.price || !menuType.menu_list_type_id) {
      alert("All fields are required!");
      return;
    }

    if (isNaN(menuType.price) || Number(menuType.price) <= 0) {
      alert("Price must be a positive number!");
      return;
    }

    // Check for duplicate menu type names (case-insensitive)
    const isDuplicate = menuTypes.some(mt => mt.menu_type_name.toLowerCase() === trimmedName.toLowerCase());
    if (isDuplicate && btnname === "Add Menu Type") {
      alert("Menu type name already exists!");
      return;
    }

    try {
      if (btnname === 'Add Menu Type') {
        // Add new menu type
        await addMenuType({ ...menuType, menu_type_name: trimmedName });
        alert('Menu Type added successfully!');
      } else if (btnname === 'Update') {
        // Update existing menu type
        await updateMenuTypeById({ ...menuType, menu_type_name: trimmedName });
        alert('Menu Type updated successfully!');
        setBtnname('Add Menu Type');
      }

      // Reset the form
      setMenuType({ menu_type_id: '', menu_type_name: '', price: '', menu_list_type_id: '' });

      // Refresh the menu type list
      const updatedMenuTypes = await getMenuTypes();
      setMenuTypes(updatedMenuTypes);
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while processing the menu type.');
    }
  };

  // Handle input changes and validate price field
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Prevents non-numeric input in price field
    if (name === "price" && value !== "" && !/^\d+(\.\d{0,2})?$/.test(value)) {
      return; 
    }

    setMenuType((prev) => ({ ...prev, [name]: value }));
  };

  // Handle editing an existing menu type
  const handleEdit = async (id) => {
    try {
      const menuTypeData = await getMenuTypeById(id);
      if (!menuTypeData) {
        alert('Menu type not found.');
        return;
      }

      // Populate form with existing data
      setMenuType({
        menu_type_id: id,
        menu_type_name: menuTypeData.menu_type_name,
        price: menuTypeData.price,
        menu_list_type_id: menuTypeData.menu_list_type_id,
      });
      setBtnname('Update');
    } catch (error) {
      console.error('Error fetching menu type by ID:', error);
      alert('An error occurred while fetching the menu type.');
    }
  };

  // Handle deletion of a menu type
  const handleDelete = async (id) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this menu?');
    if (!isConfirmed) return; 
    try {
      const response = await deleteMenuType(id);
      if (response) {
        alert(response.message);
        const updatedMenuTypes = await getMenuTypes();
        setMenuTypes(updatedMenuTypes);
      }
    } catch (error) {
      console.error('Error deleting menu type:', error);
      alert('An error occurred while deleting the menu type.');
    }
  };

  return (
    <div className="flex justify-between items-start mt-10 px-10 gap-2">
      {/* Create Menu Type Form */}
      <div className="w-1/2 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-sm font-semibold text-black mb-5">Create Menu Type</h2>
        <form onSubmit={handleSubmit}>
          {/* Menu Type Name Input */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-900">Menu Type Name</label>
            <input 
              type="text" 
              name="menu_type_name" 
              required 
              placeholder="Enter Menu Type name"
              value={menuType.menu_type_name} 
              onChange={handleChange} 
              className="block w-full rounded-md bg-white px-3 py-2 border border-gray-300 focus:border-gray-500 focus:outline-none" />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-900">Price</label>
            <input 
            type="text" 
            name="price" 
            required 
            placeholder="Enter Price"
            value={menuType.price} 
            onChange={handleChange} 
            className="block w-full rounded-md bg-white px-3 py-2 border border-gray-300 focus:border-gray-500 focus:outline-none" />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-900">Select Menu List Type</label>
            <select name="menu_list_type_id" required value={menuType.menu_list_type_id} onChange={handleChange} className="block w-full rounded-md bg-white px-3 py-2 border border-gray-300 focus:border-gray-500 focus:outline-none">
              <option value="" disabled>Select a menu list type</option>
              {menuListTypes.map((menuListType) => (
                <option key={menuListType.menu_list_type_id} value={menuListType.menu_list_type_id}>{menuListType.menu_list_name}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="w-full bg-gray-500 text-white py-2 mt-4 rounded-lg hover:bg-gray-600">{btnname}</button>
        </form>
      </div>
      
      {/* Display Menu Types table */}
      <div className="w-1/2 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-sm font-semibold text-black mb-5">Menu Types</h2>
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Price</th>
              <th colSpan={2}>Action</th>
            </tr>
          </thead>
          <tbody>
            {menuTypes.map((menuType, index) => (
              <tr key={index} className="border">
                <td className="border px-4 py-2">{menuType.menu_type_id}</td>
                <td className="border px-4 py-2">{menuType.menu_type_name}</td>
                <td className="border px-4 py-2">Rs.{menuType.price}</td>
                <td><button className="border px-3 py-1 bg-blue-500 text-sm text-white" onClick={() => handleEdit(menuType.menu_type_id)}>Edit</button></td>
                <td><button className="border px-3 py-1 bg-red-500 text-sm text-white" onClick={() => handleDelete(menuType.menu_type_id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CreateMenuType;
