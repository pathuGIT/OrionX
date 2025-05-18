import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCategories, addCategory, getCategoryById, deleteCategory, updateCategoryById } from '../../services/MenuService';
import CreateItem from './CreateItem';

function CreateCategory({setRenderContent}) {
  // State to hold current category input
  const [category, setCategory] = useState({ category_id: '', category_name: '' });

  // State to hold the list of all categories
  const [categories, setCategories] = useState([]);

  // Button name (switches between 'Add Category' and 'Update')
  const [btnname, setBtnname] = useState('Add Category');

  const navigate = useNavigate();

  // Fetch all categories on initial render and set default ID
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await getCategories();
        setCategories(fetchedCategories);

        // Generate next category ID (e.g., C000002)
        const nextId = fetchedCategories.length
          ? `C${(fetchedCategories.length + 1).toString().padStart(6, '0')}`
          : 'C000001';

        setCategory((prev) => ({ ...prev, category_id: nextId }));
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // Check if category name already exists (case-insensitive)
  const handleValidation = () => {
    return categories.some(
      (item) => item.category_name.toLowerCase() === category.category_name.toLowerCase()
    );
  };

  // Handle form submission for adding or updating category
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate input is not empty or whitespace
    if (!category.category_name.trim()) {
      alert('Category name cannot be empty or just spaces!');
      return;
    }

    // Validate uniqueness
    if (handleValidation()) {
      alert('This category name already exists! PlsetRenderContent(() => () => <CreateItem />);ease enter a unique name.');
      return;
    }

    try {
      if (btnname === 'Add Category') {
        await addCategory(category);
        alert('Category added successfully!');
        setCategory({ category_name: '' }); // Reset input after adding

        setRenderContent(() => () => <CreateItem/>);
      } else if (btnname === 'Update') {
        await updateCategoryById(category.category_id, category.category_name);
        alert('Category updated successfully!');
        setCategory({ category_name: '' }); // Reset input after updating
        setBtnname('Add Category'); // Reset button name
      }

      // Refresh category list after operation
      const updatedCategories = await getCategories();
      setCategories(updatedCategories);
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while processing the category.');
    }
  };

  // Handle input field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategory((prev) => ({ ...prev, [name]: value }));
  };

  // Populate form for editing a specific category
  const handleEdit = async (id) => {
    try {
      const fetchedCategory = await getCategoryById(id);
      if (!fetchedCategory) {
        alert('Category ID not found.');
        return;
      }
      setCategory({ category_id: id, category_name: fetchedCategory.category_name });
      setBtnname('Update');
    } catch (error) {
      console.error('Error fetching category by ID:', error);
    }
  };

  // Delete a category after confirmation
  const handleDelete = async (id) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this menu?');
    if (!isConfirmed) return;

    try {
      const deleteResponse = await deleteCategory(id);
      if (deleteResponse) {
        alert(deleteResponse.message);

        // Refresh category list after deletion
        const updatedCategories = await getCategories();
        setCategories(updatedCategories);
      }
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  return (
    <div className="flex justify-between items-start mt-10 px-10 gap-2">
      
      {/* Category Input Form */}
      <div className="w-1/2 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-sm font-semibold text-black mb-5">Create Category</h2>
        <form onSubmit={handleSubmit}>
          
          {/* Category Name Input */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-900">Category Name</label>
            <input
              type="text"
              name="category_name"
              required
              placeholder="Enter category name"
              value={category.category_name}
              onChange={handleChange}
              className="block w-full rounded-md bg-white px-3 py-2 text-gray-900 border border-gray-300 focus:border-gray-500 focus:outline-none"
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="w-full bg-gray-500 text-white py-2 mt-4 rounded-lg hover:bg-gray-600">
            {btnname}
          </button>
        </form>
      </div>

      {/* Category List Table */}
      <div className="w-1/2 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-sm font-semibold text-black mb-5">Categories</h2>
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2 text-sm">ID</th>
              <th className="border px-4 py-2 text-sm">Name</th>
              <th colSpan={2}>Action</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat, index) => (
              <tr key={index} className="border">
                <td className="border px-4 py-2 text-sm">{cat.category_id}</td>
                <td className="border px-4 py-2 text-sm">{cat.category_name}</td>

                {/* Edit Button */}
                <td>
                  <button className="border px-3 py-1 bg-blue-500 text-sm" onClick={() => handleEdit(cat.category_id)}>
                    Edit
                  </button>
                </td>

                {/* Delete Button */}
                <td>
                  <button className="border px-3 py-1 bg-red-500 text-sm" onClick={() => handleDelete(cat.category_id)}>
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

export default CreateCategory;
