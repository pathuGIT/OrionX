import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCategories, addCategory, getCategoryById, deleteCategory, updateCategoryById } from '../../services/MenuService';
import CreateItem from './CreateItem';

function CreateCategory({setRenderContent}) {
  const [category, setCategory] = useState({ category_id: '', category_name: '' });
  const [categories, setCategories] = useState([]);
  const [btnname, setBtnname] = useState('Add Category');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await getCategories();
        setCategories(fetchedCategories);

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

  const handleValidation = () => {
    return categories.some(
      (item) => item.category_name.toLowerCase() === category.category_name.toLowerCase()
    );
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
        setRenderContent(() => () => <CreateItem />);
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
    const isConfirmed = window.confirm('Are you sure you want to delete this menu?');
    if (!isConfirmed) return;

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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Category Management</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form Section */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
            <div className="border-b border-gray-200 pb-4 mb-6">
              <h2 className="text-lg font-semibold text-gray-800">Create Category</h2>
              <p className="text-sm text-gray-500">Add or update menu categories</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                <input
                  type="text"
                  name="category_name"
                  required
                  placeholder="Enter category name"
                  value={category.category_name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                />
              </div>
              
              <button
                type="submit"
                className={`w-full py-2 px-4 rounded-lg font-medium text-white transition duration-200 ${
                  btnname === 'Add Category' 
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
              <h2 className="text-lg font-semibold text-gray-800">Categories</h2>
              <p className="text-sm text-gray-500">Current menu categories</p>
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
                  {categories.map((cat, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {cat.category_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {cat.category_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleEdit(cat.category_id)}
                          className="text-blue-600 hover:text-blue-900 px-3 py-1 rounded-md bg-blue-50 hover:bg-blue-100 transition duration-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(cat.category_id)}
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

export default CreateCategory;