import React, { useState, useEffect } from 'react';
import { getCategories, addCategory } from '../../services/MenuService';

function CreateCategory() {
  const [category, setCategory] = useState({ category_id: '', category_name: '' });
  const [categories, setCategories] = useState([]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addCategory(category);
      alert('Category added successfully!');
      setCategory({ category_name: '' });
      
      // Refresh categories after adding
      const updatedCategories = await getCategories();
      setCategories(updatedCategories);
    } catch (error) {
      console.error('Adding Error:', error);
      alert('An error occurred while adding the category.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategory((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex justify-between items-start mt-10 px-10">
      {/* Left Side - Form */}
      <div className="w-1/2 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-black mb-5">Create Category</h2>
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
              className="block w-full rounded-md bg-white px-3 py-2 border border-gray-300 focus:border-gray-500 focus:outline-none"
            />
          </div>
          <button type="submit" className="w-full bg-gray-500 text-white py-2 mt-4 rounded-lg hover:bg-gray-600">
            Add Category
          </button>
        </form>
      </div>
      
      {/* Right Side - Table */}
      <div className="w-1/2 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-black mb-5">Categories</h2>
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">Name</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat, index) => (
              <tr key={index} className="border">
                <td className="border px-4 py-2">{cat.category_id}</td>
                <td className="border px-4 py-2">{cat.category_name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CreateCategory;
