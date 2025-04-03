import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCategories, addCategory, getCategoryById, deleteCategory, updateCategoryById } from '../../services/MenuService';

function CreateCategory() {
  const [category, setCategory] = useState({ category_id: '', category_name: '' });
  const [categories, setCategories] = useState([]);
  const [btnname, setBtnname] = useState('Add Category');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await getCategories();
        setCategories(fetchedCategories);
        const nextId = fetchedCategories.length ? `C${(fetchedCategories.length + 1).toString().padStart(6, '0')}` : 'C000001';
        setCategory((prev) => ({ ...prev, category_id: nextId }));
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleValidation = () => {
    return categories.some((item) => item.category_name.toLowerCase() === category.category_name.toLowerCase());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category.category_name.trim()) {
      alert('Category name cannot be empty or just spaces!');
      return;
    }

    if (handleValidation()) {
      alert('This category name already exists! Please enter a unique name.');
      return;
    }

    try {
      if (btnname === 'Add Category') {
        await addCategory(category);
        alert('Category added successfully!');
        setCategory({ category_name: '' });
      } else if (btnname === 'Update') {
        await updateCategoryById(category.category_id, category.category_name);
        alert('Category updated successfully!');
        setCategory({ category_name: '' });
        setBtnname('Add Category');
      }
      const updatedCategories = await getCategories();
      setCategories(updatedCategories);
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while processing the category.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategory((prev) => ({ ...prev, [name]: value }));
  };

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

  const handleDelete = async (id) => {
    try {
      const deleteResponse = await deleteCategory(id);
      if (deleteResponse) {
        alert(deleteResponse.message);
        const updatedCategories = await getCategories();
        setCategories(updatedCategories);
      }
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  return (
    <div className="flex justify-between items-start mt-10 px-10 gap-2">
      <div className="w-1/2 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-sm font-semibold text-black mb-5">Create Category</h2>
        <form onSubmit={handleSubmit}>
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
          <button type="submit" className="w-full bg-gray-500 text-white py-2 mt-4 rounded-lg hover:bg-gray-600">
            {btnname}
          </button>
        </form>
      </div>

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
                <td>
                  <button className="border px-3 py-1 bg-blue-500 text-sm" onClick={() => handleEdit(cat.category_id)}>
                    Edit
                  </button>
                </td>
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
