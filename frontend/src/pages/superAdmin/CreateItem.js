import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getItems, addItem, getItemById, deleteItem, updateItem } from '../../services/MenuService';

function CreateItem({setRenderContent}) {
  const [item, setItem] = useState({ item_id: '', item_name: '' });
  const [items, setItems] = useState([]);
  const [btnName, setBtnName] = useState('Add Item');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const fetchedItems = await getItems();
        setItems(fetchedItems);

        const nextId = fetchedItems.length
          ? `IT${(fetchedItems.length + 1).toString().padStart(6, '0')}`
          : 'IT000001';

        setItem((prevItem) => ({ ...prevItem, item_id: nextId }));
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };

    fetchItems();
  }, []);

  const handleValidation = () => {
    return items.some(
      (existingItem) => existingItem.item_name.toLowerCase() === item.item_name.toLowerCase()
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!item.item_name.trim()) {
      alert('Item name cannot be empty or just spaces!');
      return;
    }

    if (handleValidation()) {
      alert('This item name already exists! Please enter a unique name.');
      return;
    }

    try {
      if (btnName === 'Add Item') {
        await addItem(item);
        alert('Item added successfully!');
      } else {
        await updateItem(item.item_id, item.item_name);
        alert('Item updated successfully!');
        setBtnName('Add Item');
      }

      setItem({ item_name: '' });
      const updatedItems = await getItems();
      setItems(updatedItems);
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while processing the item.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItem((prevItem) => ({ ...prevItem, [name]: value }));
  };

  const handleEdit = async (id) => {
    try {
      const itemById = await getItemById(id);
      if (!itemById) {
        alert('Item ID not found.');
        return;
      }

      setItem({ item_id: id, item_name: itemById.item_name });
      setBtnName('Update');
    } catch (error) {
      console.error('Error fetching item by ID:', error);
    }
  };

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this menu?');
    if (!isConfirmed) return;

    try {
      const deleteResponse = await deleteItem(id);
      if (deleteResponse) {
        alert(deleteResponse.message);
        const updatedItems = await getItems();
        setItems(updatedItems);
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Item Management</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form Section */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
            <div className="border-b border-gray-200 pb-4 mb-6">
              <h2 className="text-lg font-semibold text-gray-800">Create Item</h2>
              <p className="text-sm text-gray-500">Add or update menu items</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                <input
                  type="text"
                  name="item_name"
                  required
                  placeholder="Enter item name"
                  value={item.item_name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                />
              </div>

              <button
                type="submit"
                className={`w-full py-2 px-4 rounded-lg font-medium text-white transition duration-200 ${
                  btnName === 'Add Item' 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {btnName}
              </button>
            </form>
          </div>

          {/* Table Section */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
            <div className="border-b border-gray-200 pb-4 mb-6">
              <h2 className="text-lg font-semibold text-gray-800">Items</h2>
              <p className="text-sm text-gray-500">Current menu items</p>
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
                  {items.map((it, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {it.item_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {it.item_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleEdit(it.item_id)}
                          className="text-blue-600 hover:text-blue-900 px-3 py-1 rounded-md bg-blue-50 hover:bg-blue-100 transition duration-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(it.item_id)}
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

export default CreateItem;