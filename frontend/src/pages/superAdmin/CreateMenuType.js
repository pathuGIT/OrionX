import React, { useState, useEffect } from 'react';
import { getMenuTypes, addMenuType, getMenus, deleteMenuType, updateMenuTypeById, getMenuTypeById } from '../../services/MenuService';
import CreateCategory from './CreateCategories';

function CreateMenuType({setRenderContent}) {
  const [menuType, setMenuType] = useState({ menu_type_id: '', menu_type_name: '', price: '', menu_list_type_id: '' });
  const [menuTypes, setMenuTypes] = useState([]);
  const [menuListTypes, setMenuListTypes] = useState([]);
  const [btnname, setBtnname] = useState('Add Menu Type');

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
        const fetchedMenuListTypes = await getMenus();
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

    const trimmedName = menuType.menu_type_name.trim();

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

    const isDuplicate = menuTypes.some(mt => mt.menu_type_name.toLowerCase() === trimmedName.toLowerCase());
    if (isDuplicate && btnname === "Add Menu Type") {
      alert("Menu type name already exists!");
      return;
    }

    try {
      if (btnname === 'Add Menu Type') {
        await addMenuType({ ...menuType, menu_type_name: trimmedName });
        alert('Menu Type added successfully!');
        setMenuType({ menu_type_id: '', menu_type_name: '', price: '', menu_list_type_id: '' });

        const updatedMenuTypes = await getMenuTypes();
        setMenuTypes(updatedMenuTypes);

        setRenderContent(() => <CreateCategory/>);
      } else if (btnname === 'Update') {
        await updateMenuTypeById({ ...menuType, menu_type_name: trimmedName });
        alert('Menu Type updated successfully!');

        const updatedMenuTypes = await getMenuTypes();
        setMenuTypes(updatedMenuTypes);
        setBtnname('Add Menu Type');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while processing the menu type.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "price" && value !== "" && !/^\d+(\.\d{0,2})?$/.test(value)) {
      return; 
    }

    setMenuType((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = async (id) => {
    try {
      const menuTypeData = await getMenuTypeById(id);
      if (!menuTypeData) {
        alert('Menu type not found.');
        return;
      }

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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Menu Type Management</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form Section */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
            <div className="border-b border-gray-200 pb-4 mb-6">
              <h2 className="text-lg font-semibold text-gray-800">Create Menu Type</h2>
              <p className="text-sm text-gray-500">Add or update menu types with pricing</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Menu Type Name</label>
                <input
                  type="text"
                  name="menu_type_name"
                  required
                  placeholder="Enter Menu Type name"
                  value={menuType.menu_type_name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (Rs.)</label>
                <input
                  type="text"
                  name="price"
                  required
                  placeholder="Enter Price"
                  value={menuType.price}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Menu List Type</label>
                <select
                  name="menu_list_type_id"
                  required
                  value={menuType.menu_list_type_id}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                >
                  <option value="" disabled>Select a menu list type</option>
                  {menuListTypes.map((menuListType) => (
                    <option key={menuListType.menu_list_type_id} value={menuListType.menu_list_type_id}>
                      {menuListType.menu_list_name}
                    </option>
                  ))}
                </select>
              </div>
              
              <button
                type="submit"
                className={`w-full py-2 px-4 rounded-lg font-medium text-white transition duration-200 ${
                  btnname === 'Add Menu Type' 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {btnname}
              </button>
            </form>
          </div>

          {/* Table Section */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
            <div className="border-b border-gray-200 pb-4 mb-6">
              <h2 className="text-lg font-semibold text-gray-800">Menu Types</h2>
              <p className="text-sm text-gray-500">Current menu types and their details</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {menuTypes.map((menuType, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {menuType.menu_type_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {menuType.menu_type_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        Rs. {menuType.price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleEdit(menuType.menu_type_id)}
                          className="text-blue-600 hover:text-blue-900 px-3 py-1 rounded-md bg-blue-50 hover:bg-blue-100 transition duration-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(menuType.menu_type_id)}
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

export default CreateMenuType;