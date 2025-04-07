import React, { useState, useEffect } from "react";
import { getItemCategoryMenuTypes, addItemCategoryMenuType, getCategoryMenuTypes, getItems } from "../../services/MenuService";

function CreateItemCategoryMenuType() {
  const [itemCategoryMenu, setItemCategoryMenu] = useState({
    item_id: '',
    category_menu_type_id: '',
  });

  const [itemCategoryMenuTypes, setItemCategoryMenuTypes] = useState([]);
  const [categoryMenuTypes, setCategoryMenuTypes] = useState([]);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItemCategoryMenuTypes = async () => {
      try {
        const fetchedItemCategoryMenuTypes = await getItemCategoryMenuTypes();
        setItemCategoryMenuTypes(fetchedItemCategoryMenuTypes);

        const fetchedCategoryMenuTypes = await getCategoryMenuTypes();
        const fetchedItems = await getItems();
        setCategoryMenuTypes(fetchedCategoryMenuTypes);
        setItems(fetchedItems);
      } catch (error) {
        console.error("Error fetching item category menu types:", error);
      }
    };
    fetchItemCategoryMenuTypes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Submitting:", itemCategoryMenu);
      await addItemCategoryMenuType(itemCategoryMenu);
      alert("Item Category Menu Type added successfully!");
      setItemCategoryMenu({ item_id: "", category_menu_type_id: "" });

      // Refresh categories after adding
      const updatedItemCategoryMenuTypes = await getItemCategoryMenuTypes();
      setItemCategoryMenuTypes(updatedItemCategoryMenuTypes);
    } catch (error) {
      alert("An error occurred while adding the item category menu type.");
      console.error(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItemCategoryMenu((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex justify-between items-start mt-10 px-10">
      {/* Left Side - Form */}
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
              {items.map((item) => (
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
              {categoryMenuTypes.map((cmt) => (
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
            Add Item Category Menu Type
          </button>
        </form>
      </div>

      {/* Right Side - Table */}
      <div className="w-1/2 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-black mb-5">Item Category Menu Types</h2>
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">ICMT ID</th>
              <th className="border px-4 py-2">Category Menu Type</th>
              <th className="border px-4 py-2">Item</th>
            </tr>
          </thead>
          <tbody>
            {itemCategoryMenuTypes.map((icmt, index) => (
              <tr key={index} className="border">
                <td className="border px-4 py-2">{icmt.icmt_id}</td>
                <td className="border px-4 py-2">
                  {icmt.menu_type_name} - {icmt.category_name}
                </td>
                <td className="border px-4 py-2">{icmt.item_name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CreateItemCategoryMenuType;
