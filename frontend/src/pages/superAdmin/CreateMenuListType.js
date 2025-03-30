import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addMenuListType, deleteMenuListType, getMenuListTypeById, getMenus, updateMenuListTypeById } from '../../services/MenuService';

function CreateMenuListType() {
  const [menu, setMenu] = useState({ menu_list_type_id: '', menu_list_name: '' });
  const [menus, setMenus] = useState([]);
  const [btnname, setBtnname] = useState('Add Menu')
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
      if(btnname == 'Add Menu'){
        await addMenuListType(menu);
        alert('Menu added successfully!');
        setMenu({ menu_list_name: '' });
  
        // Refresh menu list after adding
        const updatedMenus = await getMenus();
        setMenus(updatedMenus);
      }else if(btnname == 'Update'){
        await updateMenuListTypeById(menu.menu_list_type_id, menu.menu_list_name);
        setMenu({ menu_list_name: '' });
        alert('Menu Updated successfully!');

        // Refresh menu list after adding
        const updatedMenus = await getMenus();
        setMenus(updatedMenus);
        setBtnname('Add Menu');
      }
      
    } catch (error) {
      console.error('Adding Error:', error);
      alert('An error occurred while adding the menu list type.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMenu((prevMenu) => ({ ...prevMenu, [name]: value }));
  };


  const handleEdit = async (id) => {
    console.log(id);
    try {
      const getMeuListNameById = await getMenuListTypeById(id);

      if (!getMeuListNameById) {
        alert("Not found this id.");
        return;
      }

      // Update the menu state with the fetched data
      setMenu({
        menu_list_type_id: id,
        menu_list_name: getMeuListNameById.menu_list_name,
      });

      setBtnname('Update');
    } catch (error) {
      console.error('Error fetching menu list type by id:', error);
    }
  };

  const handleDelete = async (id) => {
    console.log(id);
    try {
      const deleteMenuList = await deleteMenuListType(id);
      if (deleteMenuList) {
        alert(deleteMenuList.message);

        // Refresh menu list after deletion
        const updatedMenus = await getMenus();
        setMenus(updatedMenus);
      }
    } catch (error) {
      console.error('Error deleting menu list type:', error);
    }
  };

  return (
    <div className="flex justify-between items-start mt-10 px-10 gap-2">
      {/* Left Side - Form */}
      <div className="w-1/2 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-sm font-semibold text-black mb-5">Create Menu</h2>
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
            {btnname}
          </button>
        </form>
      </div>

      {/* Right Side - Table */}
      <div className="w-1/2 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-sm font-semibold text-black mb-5">Menu List Types</h2>
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2 text-sm">ID</th>
              <th className="border px-4 py-2 text-sm">Name</th>
              <th colSpan={2}>Action</th>
            </tr>
          </thead>
          <tbody>
            {menus.map((menuItem, index) => (
              <tr key={index} className="border">
                <td className="border px-4 py-2 text-sm">{menuItem.menu_list_type_id}</td>
                <td className="border px-4 py-2 text-sm">{menuItem.menu_list_name}</td>
                <td><button className=' border px-3 py-1 bg-blue-500  text-sm ' onClick={() => handleEdit(menuItem.menu_list_type_id)}>Edit</button></td>
                <td><button className=' border px-3 py-1 bg-red-500  text-sm ' onClick={() => handleDelete(menuItem.menu_list_type_id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CreateMenuListType;