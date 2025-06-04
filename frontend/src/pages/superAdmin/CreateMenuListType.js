import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addMenuListType, deleteMenuListType, getMenuListTypeById, getMenus, updateMenuListTypeById } from '../../services/MenuService';
import CreateMenuType from './CreateMenuType';

function CreateMenuListType({setRenderContent}) {
  const [menu, setMenu] = useState({ menu_list_type_id: '', menu_list_name: '' });
  const [menus, setMenus] = useState([]);
  const [btnname, setBtnname] = useState('Add Menu');
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

  const handleValidation = () => {
    return menus.some((item) => item.menu_list_name.toLowerCase() === menu.menu_list_name.toLowerCase());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if the menu_list_name is empty or contains only spaces
    if (!menu.menu_list_name.trim()) {
      alert('Menu name cannot be empty or just spaces!');
      return;
    }

    if (handleValidation()) {
      alert('This menu name already exists! Please enter a unique name.');
      return;
    }

    try {
      if (btnname === 'Add Menu') {
        await addMenuListType(menu);
        alert('Menu added successfully!');
        setMenu({ menu_list_name: '' });

        // Refresh menu list after adding
        const updatedMenus = await getMenus();
        setMenus(updatedMenus);

        //navigate to CreateMenuType after adding a menulist type
       setRenderContent(() => () => <CreateMenuType />);
      } else if (btnname === 'Update') {
        await updateMenuListTypeById(menu.menu_list_type_id, menu.menu_list_name);
        setMenu({ menu_list_name: '' });
        alert('Menu updated successfully!');


        // Refresh menu list after updating
        const updatedMenus = await getMenus();
        setMenus(updatedMenus);
        setBtnname('Add Menu');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while processing the menu.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMenu((prevMenu) => ({ ...prevMenu, [name]: value }));
  };

  const handleEdit = async (id) => {
    try {
      const menuById = await getMenuListTypeById(id);
      if (!menuById) {
        alert('Menu ID not found.');
        return;
      }

      setMenu({
        menu_list_type_id: id,
        menu_list_name: menuById.menu_list_name,
      });

      setBtnname('Update');
    } catch (error) {
      console.error('Error fetching menu list type by ID:', error);
    }
  };

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this menu?');
    if (!isConfirmed) return; 

    try {
      const deleteResponse = await deleteMenuListType(id);
      if (deleteResponse) {
        alert(deleteResponse.message);

        // Refresh menu list after deletion
        const updatedMenus = await getMenus();
        setMenus(updatedMenus);
      }
    } catch (error) {
      console.error('Error deleting menu list type:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Menu Management</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form Section */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
            <div className="border-b border-gray-200 pb-4 mb-6">
              <h2 className="text-lg font-semibold text-gray-800">Create Menu</h2>
              <p className="text-sm text-gray-500">Add or update menu list types</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Menu List Name</label>
                <input
                  type="text"
                  name="menu_list_name"
                  required
                  placeholder="Enter menu list name"
                  value={menu.menu_list_name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                />
              </div>
              
              <button
                type="submit"
                className={`w-full py-2 px-4 rounded-lg font-medium text-white transition duration-200 ${
                  btnname === 'Add Menu' 
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
              <h2 className="text-lg font-semibold text-gray-800">Menu List Types</h2>
              <p className="text-sm text-gray-500">Manage existing menu types</p>
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
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {menus.map((menuItem, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {menuItem.menu_list_type_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {menuItem.menu_list_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleEdit(menuItem.menu_list_type_id)}
                          className="text-blue-600 hover:text-blue-900 px-3 py-1 rounded-md bg-blue-50 hover:bg-blue-100 transition duration-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(menuItem.menu_list_type_id)}
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

export default CreateMenuListType;