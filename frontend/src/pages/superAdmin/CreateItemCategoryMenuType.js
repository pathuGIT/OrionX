import React, { useState, useEffect } from "react";
import {
  getItemCategoryMenuTypes,
  addItemCategoryMenuType,
  getCategoryMenuTypes,
  getItems,
  deleteItemCategoryMenuType,
  updateItemCategoryMenuTypeById,
  getItemCategoryMenuTypeById
} from "../../services/MenuService";

function CreateItemCategoryMenuType() {
  const [itemCategoryMenu, setItemCategoryMenu] = useState({
    item_id: "",
    category_menu_type_id: ""
  });

  const [itemCategoryMenuTypes, setItemCategoryMenuTypes] = useState([]);
  const [categoryMenuTypes, setCategoryMenuTypes] = useState([]);
  const [items, setItems] = useState([]);
  const [btnName, setBtnName] = useState('Add Item Category Menu Type');
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [icmts, cmts, its] = await Promise.all([
          getItemCategoryMenuTypes(),
          getCategoryMenuTypes(),
          getItems()
        ]);
        
        setItemCategoryMenuTypes(icmts);
        setCategoryMenuTypes(cmts);
        setItems(its);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (btnName === 'Add Item Category Menu Type') {
        await addItemCategoryMenuType(itemCategoryMenu);
        alert("Added successfully!");
      } else {
        await updateItemCategoryMenuTypeById(selectedId, itemCategoryMenu);
        alert("Updated successfully!");
        setBtnName('Add Item Category Menu Type');
        setSelectedId(null);
      }

      // Refresh data
      const updated = await getItemCategoryMenuTypes();
      setItemCategoryMenuTypes(updated);
      setItemCategoryMenu({ item_id: "", category_menu_type_id: "" });
      
    } catch (error) {
      alert("Operation failed!");
      console.error(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItemCategoryMenu(prev => ({ ...prev, [name]: value }));
  };

  const handleEdit = async (icmtId) => {
    try {
      const data = await getItemCategoryMenuTypeById(icmtId);
      setItemCategoryMenu({
        item_id: data.item_id,
        category_menu_type_id: data.category_menu_type_id
      });
      setSelectedId(icmtId);
      setBtnName('Update');
    } catch (error) {
      console.error("Error fetching for edit:", error);
    }
  };

  const handleDelete = async (icmtId) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await deleteItemCategoryMenuType(icmtId);
      alert("Deleted successfully!");
      const updated = await getItemCategoryMenuTypes();
      setItemCategoryMenuTypes(updated);
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  // Helper functions for display names
  const getItemName = (itemId) => 
    items.find(i => i.item_id === itemId)?.item_name || itemId;
  
  const getCMTName = (cmtId) => {
    const cmt = categoryMenuTypes.find(c => c.category_menu_type_id === cmtId);
    return cmt ? `${cmt.menu_type_name} - ${cmt.category_name}` : cmtId;
  };

  return (
    <div className="flex justify-between items-start mt-10 px-10 gap-4">
      {/* Form Section */}
      <div className="w-1/2 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-black mb-5">Item Category Menu Type</h2>
        <form onSubmit={handleSubmit}>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-900">Item</label>
            <select
              name="item_id"
              required
              value={itemCategoryMenu.item_id}
              onChange={handleChange}
              className="block w-full rounded-md bg-white px-3 py-2 border border-gray-300 focus:border-gray-500 focus:outline-none"
            >
              <option value="">Select Item</option>
              {items.map(item => (
                <option key={item.item_id} value={item.item_id}>
                  {item.item_name}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-900">Category Menu Type</label>
            <select
              name="category_menu_type_id"
              required
              value={itemCategoryMenu.category_menu_type_id}
              onChange={handleChange}
              className="block w-full rounded-md bg-white px-3 py-2 border border-gray-300 focus:border-gray-500 focus:outline-none"
            >
              <option value="">Select Category Menu Type</option>
              {categoryMenuTypes.map(cmt => (
                <option key={cmt.category_menu_type_id} value={cmt.category_menu_type_id}>
                  {`${cmt.menu_type_name} - ${cmt.category_name}`}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-gray-500 text-white py-2 mt-4 rounded-lg hover:bg-gray-600"
          >
            {btnName}
          </button>
        </form>
      </div>

      {/* Table Section */}
      <div className="w-1/2 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-black mb-5">Existing Mappings</h2>
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">ICMT ID</th>
              <th className="border px-4 py-2">Category Menu Type</th>
              <th className="border px-4 py-2">Item</th>
              <th colSpan={2} className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {itemCategoryMenuTypes.map(icmt => (
              <tr key={icmt.icmt_id} className="border">
                <td className="border px-4 py-2">{icmt.icmt_id}</td>
                <td className="border px-4 py-2">{getCMTName(icmt.category_menu_type_id)}</td>
                <td className="border px-4 py-2">{getItemName(icmt.item_id)}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => handleEdit(icmt.icmt_id)}
                    className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                  >
                    Edit
                  </button>
                </td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => handleDelete(icmt.icmt_id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
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
  );
}

export default CreateItemCategoryMenuType;
