import React, { useState, useEffect } from 'react';
import { getItems, addItem } from '../../services/MenuService';

function CreateItem() {
  const [item, setItem] = useState({ item_id: '', item_name: '' });
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const fetchedItems = await getItems();
        setItems(fetchedItems);
        const nextId = fetchedItems.length ? `IT${(fetchedItems.length + 1).toString().padStart(6, '0')}` : 'IT000001';
        setItem((prev) => ({ ...prev, item_id: nextId }));
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };
    fetchItems();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addItem(item);
      alert('Item added successfully!');
      setItem({ item_name: '' });
      
      // Refresh items after adding
      const updatedItems = await getItems();
      setItems(updatedItems);
    } catch (error) {
      console.error('Adding Error:', error);
      alert('An error occurred while adding the item.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItem((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex justify-between items-start mt-10 px-10">
      {/* Left Side - Form */}
      <div className="w-1/2 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-black mb-5">Create Item</h2>
        <form onSubmit={handleSubmit}>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-900">Item Name</label>
            <input
              type="text"
              name="item_name"
              required
              placeholder="Enter item name"
              value={item.item_name}
              onChange={handleChange}
              className="block w-full rounded-md bg-white px-3 py-2 border border-gray-300 focus:border-gray-500 focus:outline-none"
            />
          </div>
          <button type="submit" className="w-full bg-gray-500 text-white py-2 mt-4 rounded-lg hover:bg-gray-600">
            Add Item
          </button>
        </form>
      </div>
      
      {/* Right Side - Table */}
      <div className="w-1/2 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-black mb-5">Items</h2>
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">Name</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it, index) => (
              <tr key={index} className="border">
                <td className="border px-4 py-2">{it.item_id}</td>
                <td className="border px-4 py-2">{it.item_name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CreateItem;
