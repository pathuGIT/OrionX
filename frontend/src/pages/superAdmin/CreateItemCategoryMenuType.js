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
    console.log("1 Change detected:", name, value);
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

  const getItemName = (itemId) =>
    items.find(i => i.item_id === itemId)?.item_name || itemId;

  const getCMTName = (cmtId) => {
    const cmt = categoryMenuTypes.find(c => c.category_menu_type_id === cmtId);
    return cmt ? `${cmt.menu_type_name} - ${cmt.category_name}` : cmtId;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Item Category Menu Type Management</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form Section */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
            <div className="border-b border-gray-200 pb-4 mb-6">
              <h2 className="text-lg font-semibold text-gray-800">Create Item Category Menu Type</h2>
              <p className="text-sm text-gray-500">Link items with category menu types</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Item</label>
                <select
                  name="item_id"
                  required
                  value={itemCategoryMenu.item_id}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                >
                  <option value="">Select Item</option>
                  {items.map(item => (
                    <option key={item.item_id} value={item.item_id}>
                      {item.item_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Item</label>
                <select
                  name="category_menu_type_id"
                  required
                  value={itemCategoryMenu.category_menu_type_id}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                >
                  <option value="">Select Category Menu Type</option>
                  {categoryMenuTypes.map(cmt => (
                    <option key={cmt.category_menu_type_Id} value={cmt.category_menu_type_Id}>
                      {cmt.menu_type_name + ` -- ` + cmt.category_name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className={`w-full py-2 px-4 rounded-lg font-medium text-white transition duration-200 ${btnName === 'Add Item Category Menu Type'
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
              <h2 className="text-lg font-semibold text-gray-800">Existing Mappings</h2>
              <p className="text-sm text-gray-500">Current item to category menu type associations</p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ICMT ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category Menu Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Item
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {itemCategoryMenuTypes.map(icmt => (
                    <tr key={icmt.ICMT_Id} className="hover:bg-gray-50 transition duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {icmt.ICMT_Id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {getCMTName(icmt.category_menu_type_id)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {getItemName(icmt.item_id)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleEdit(icmt.ICMT_Id)}
                          className="text-blue-600 hover:text-blue-900 px-3 py-1 rounded-md bg-blue-50 hover:bg-blue-100 transition duration-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(icmt.ICMT_Id)}
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

export default CreateItemCategoryMenuType;