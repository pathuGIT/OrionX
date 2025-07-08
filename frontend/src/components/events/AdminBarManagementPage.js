// src/components/BarManagement.js
import React, { useState, useEffect } from 'react';
import {
  getAllBarTimes, updateBarTime, deleteBarTime,
  getAllBites, updateBite, deleteBite,
  getAllLiquorItems, updateLiquorItem, deleteLiquorItem,
  getAllSoftDrinkItems, updateSoftDrinkItem, deleteSoftDrinkItem
} from '../../services/EventService';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminBarManagementPage = () => {
  const [activeTab, setActiveTab] = useState('barTimes');
  const [barTimes, setBarTimes] = useState([]);
  const [bites, setBites] = useState([]);
  const [liquorItems, setLiquorItems] = useState([]);
  const [softDrinkItems, setSoftDrinkItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const initialFormState = {
    LiquorTimeFrom: '',
    LiquorTimeTo: '',
    BarPax: '',
    TotalBitePrice: '',
    TotalLiquorPrice: '',
    TotalSoftDrinkPrice: '',
    Quantity: '',
    menu_type_id: '',
    item_name: '',
    quantity: '',
    usages: '',
    LiquorPrice: '',
    Soft_Drink_name: '',
    DrinkPrice: '',
    BarRequirementID: '',
  };

  const [formData, setFormData] = useState(initialFormState);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        switch (activeTab) {
          case 'barTimes':
            const bars = await getAllBarTimes();
            setBarTimes(bars);
            break;
          case 'biteMenu':
            const bitesData = await getAllBites();
            setBites(bitesData);
            break;
          case 'liquorItems':
            const liquorData = await getAllLiquorItems();
            setLiquorItems(liquorData);
            break;
          case 'softDrinkItems':
            const softDrinksData = await getAllSoftDrinkItems();
            setSoftDrinkItems(softDrinksData);
            break;
          default:
            break;
        }
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setFormData(initialFormState);
    setEditingId(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEdit = (item) => {
    setFormData({ ...initialFormState, ...item });
    setEditingId(item.BarRequirementID || item.id || item.Liquor_ID || item.Soft_Drink_id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData(initialFormState);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editingId) return;

    setLoading(true);
    try {
      let result;
      const dataForApi = { ...formData };

      switch (activeTab) {
        case 'barTimes':
          result = await updateBarTime(editingId, dataForApi);
          setBarTimes(prev => prev.map(b => b.BarRequirementID === editingId ? result : b));
          toast.success('Bar time updated successfully');
          break;
        case 'biteMenu':
          result = await updateBite(editingId, dataForApi);
          setBites(prev => prev.map(b => b.id === editingId ? result : b));
          toast.success('Bite menu item updated successfully');
          break;
        case 'liquorItems':
          result = await updateLiquorItem(editingId, dataForApi);
          setLiquorItems(prev => prev.map(l => l.Liquor_ID === editingId ? result : l));
          toast.success('Liquor item updated successfully');
          break;
        case 'softDrinkItems':
          result = await updateSoftDrinkItem(editingId, dataForApi);
          setSoftDrinkItems(prev => prev.map(s => s.Soft_Drink_id === editingId ? result : s));
          toast.success('Soft drink item updated successfully');
          break;
        default:
          break;
      }
      closeModal();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    setLoading(true);
    try {
      switch (activeTab) {
        case 'barTimes':
          await deleteBarTime(id);
          setBarTimes(prev => prev.filter(b => b.BarRequirementID !== id));
          toast.success('Bar time deleted successfully');
          break;
        case 'biteMenu':
          await deleteBite(id);
          setBites(prev => prev.filter(b => b.id !== id));
          toast.success('Bite menu item deleted successfully');
          break;
        case 'liquorItems':
          await deleteLiquorItem(id);
          setLiquorItems(prev => prev.filter(l => l.Liquor_ID !== id));
          toast.success('Liquor item deleted successfully');
          break;
        case 'softDrinkItems':
          await deleteSoftDrinkItem(id);
          setSoftDrinkItems(prev => prev.filter(s => s.Soft_Drink_id !== id));
          toast.success('Soft drink item deleted successfully');
          break;
        default:
          break;
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderForm = () => (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Edit {
        {
          'barTimes': 'Bar Time',
          'biteMenu': 'Bite Menu Item',
          'liquorItems': 'Liquor Item',
          'softDrinkItems': 'Soft Drink Item'
        }[activeTab]
      }</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {activeTab === 'barTimes' && (
          <>
            <div>
              <label className="block text-gray-700 mb-2">Liquor Time From</label>
              <input type="time" name="LiquorTimeFrom" value={formData.LiquorTimeFrom} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md" required />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Liquor Time To</label>
              <input type="time" name="LiquorTimeTo" value={formData.LiquorTimeTo} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md" required />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Bar Pax</label>
              <input type="number" name="BarPax" value={formData.BarPax} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md" />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Total Bite Price (₹)</label>
              <input type="number" name="TotalBitePrice" value={formData.TotalBitePrice} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md" step="0.01" />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Total Liquor Price (₹)</label>
              <input type="number" name="TotalLiquorPrice" value={formData.TotalLiquorPrice} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md" step="0.01" />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Total Soft Drink Price (₹)</label>
              <input type="number" name="TotalSoftDrinkPrice" value={formData.TotalSoftDrinkPrice} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md" step="0.01" />
            </div>
          </>
        )}
        {activeTab === 'biteMenu' && (
          <>
            <div>
              <label className="block text-gray-700 mb-2">Quantity</label>
              <input type="number" name="Quantity" value={formData.Quantity} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md" required />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Menu Type ID</label>
              <input type="text" name="menu_type_id" value={formData.menu_type_id} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md" required />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Bar Requirement ID</label>
              <input type="text" name="BarRequirementID" value={formData.BarRequirementID} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md" required />
            </div>
          </>
        )}
        {activeTab === 'liquorItems' && (
          <>
            <div>
              <label className="block text-gray-700 mb-2">Item Name</label>
              <input type="text" name="item_name" value={formData.item_name} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md" required />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Quantity</label>
              <input type="number" name="quantity" value={formData.quantity} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md" required />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Usages</label>
              <select name="usages" value={formData.usages} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md">
                <option value="">Select Usage</option>
                <option value="bar">Bar</option>
                <option value="table">Table</option>
                <option value="both">Both</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Bar Requirement ID</label>
              <input type="text" name="BarRequirementID" value={formData.BarRequirementID} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md" required />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Liquor Price (₹)</label>
              <input type="number" name="LiquorPrice" value={formData.LiquorPrice} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md" step="0.01" required />
            </div>
          </>
        )}
        {activeTab === 'softDrinkItems' && (
          <>
            <div>
              <label className="block text-gray-700 mb-2">Soft Drink Name</label>
              <input type="text" name="Soft_Drink_name" value={formData.Soft_Drink_name} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md" required />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Quantity</label>
              <input type="number" name="quantity" value={formData.quantity} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md" required />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Usages</label>
              <select name="usages" value={formData.usages} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md" >
                <option value="">Select Usage</option>
                <option value="bar">Bar</option>
                <option value="table">Table</option>
                <option value="both">Both</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Bar Requirement ID</label>
              <input type="text" name="BarRequirementID" value={formData.BarRequirementID} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md" required />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Drink Price (₹)</label>
              <input type="number" name="DrinkPrice" value={formData.DrinkPrice} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md" step="0.01" required />
            </div>
          </>
        )}
      </div>
      <div className="flex space-x-3">
        <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50">
          {loading ? 'Saving...' : 'Update'}
        </button>
        <button type="button" onClick={closeModal} className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600">
          Cancel
        </button>
      </div>
    </form>
  );

  const renderTable = () => {
    switch (activeTab) {
      case 'barTimes':
        return (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-4 text-left">ID</th>
                    <th className="py-3 px-4 text-left">Time From</th>
                    <th className="py-3 px-4 text-left">Time To</th>
                    <th className="py-3 px-4 text-left">Bar Pax</th>
                    <th className="py-3 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {barTimes.map(bar => (
                    <tr key={bar.BarRequirementID} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{bar.BarRequirementID}</td>
                      <td className="py-3 px-4">{bar.LiquorTimeFrom}</td>
                      <td className="py-3 px-4">{bar.LiquorTimeTo}</td>
                      <td className="py-3 px-4">{bar.BarPax}</td>
                      <td className="py-3 px-4 space-x-2">
                        <button onClick={() => handleEdit(bar)} className="text-blue-600 hover:text-blue-800">Edit</button>
                        <button onClick={() => handleDelete(bar.BarRequirementID)} className="text-red-600 hover:text-red-800">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'biteMenu':
        return (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-4 text-left">Bite ID</th>
                    <th className="py-3 px-4 text-left">Quantity</th>
                    <th className="py-3 px-4 text-left">Menu Type</th>
                    <th className="py-3 px-4 text-left">Bar ID</th>
                    <th className="py-3 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bites.map(bite => (
                    <tr key={bite.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{bite.Bite_ID}</td>
                      <td className="py-3 px-4">{bite.Quantity}</td>
                      <td className="py-3 px-4">{bite.menu_type_id}</td>
                      <td className="py-3 px-4">{bite.BarRequirementID}</td>
                      <td className="py-3 px-4 space-x-2">
                        <button onClick={() => handleEdit(bite)} className="text-blue-600 hover:text-blue-800">Edit</button>
                        <button onClick={() => handleDelete(bite.id)} className="text-red-600 hover:text-red-800">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'liquorItems':
        return (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-4 text-left">ID</th>
                    <th className="py-3 px-4 text-left">Item Name</th>
                    <th className="py-3 px-4 text-left">Quantity</th>
                    <th className="py-3 px-4 text-left">Usages</th>
                    <th className="py-3 px-4 text-left">Price (₹)</th>
                    <th className="py-3 px-4 text-left">Bar ID</th>
                    <th className="py-3 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {liquorItems.map(item => (
                    <tr key={item.Liquor_ID} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{item.Liquor_ID}</td>
                      <td className="py-3 px-4">{item.item_name}</td>
                      <td className="py-3 px-4">{item.quantity}</td>
                      <td className="py-3 px-4">{item.usages}</td>
                      <td className="py-3 px-4">{item.LiquorPrice}</td>
                      <td className="py-3 px-4">{item.BarRequirementID}</td>
                      <td className="py-3 px-4 space-x-2">
                        <button onClick={() => handleEdit(item)} className="text-blue-600 hover:text-blue-800">Edit</button>
                        <button onClick={() => handleDelete(item.Liquor_ID)} className="text-red-600 hover:text-red-800">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'softDrinkItems':
        return (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-4 text-left">ID</th>
                    <th className="py-3 px-4 text-left">Drink Name</th>
                    <th className="py-3 px-4 text-left">Quantity</th>
                    <th className="py-3 px-4 text-left">Usages</th>
                    <th className="py-3 px-4 text-left">Price (₹)</th>
                    <th className="py-3 px-4 text-left">Bar ID</th>
                    <th className="py-3 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {softDrinkItems.map(item => (
                    <tr key={item.Soft_Drink_id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{item.Soft_Drink_id}</td>
                      <td className="py-3 px-4">{item.Soft_Drink_name}</td>
                      <td className="py-3 px-4">{item.quantity}</td>
                      <td className="py-3 px-4">{item.usages}</td>
                      <td className="py-3 px-4">{item.DrinkPrice}</td>
                      <td className="py-3 px-4">{item.BarRequirementID}</td>
                      <td className="py-3 px-4 space-x-2">
                        <button onClick={() => handleEdit(item)} className="text-blue-600 hover:text-blue-800">Edit</button>
                        <button onClick={() => handleDelete(item.Soft_Drink_id)} className="text-red-600 hover:text-red-800">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      default:
        return <div>No data available</div>;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Bar Management</h1>

      <div className="flex flex-wrap border-b mb-6">
        <button className={`py-2 px-4 font-medium text-sm md:text-base ${activeTab === 'barTimes' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`} onClick={() => handleTabChange('barTimes')}>
          Bar Times
        </button>
        <button className={`py-2 px-4 font-medium text-sm md:text-base ${activeTab === 'biteMenu' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`} onClick={() => handleTabChange('biteMenu')}>
          Bite Menu
        </button>
        <button className={`py-2 px-4 font-medium text-sm md:text-base ${activeTab === 'liquorItems' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`} onClick={() => handleTabChange('liquorItems')}>
          Liquor Items
        </button>
        <button className={`py-2 px-4 font-medium text-sm md:text-base ${activeTab === 'softDrinkItems' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`} onClick={() => handleTabChange('softDrinkItems')}>
          Soft Drink Items
        </button>
      </div>

      {loading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <span className="ml-4 text-gray-700">Loading data...</span>
        </div>
      )}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p>{error}</p>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-2xl">
            {renderForm()}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-xl font-semibold mb-4">
          {activeTab === 'barTimes' && 'Bar Times'}
          {activeTab === 'biteMenu' && 'Bite Menu Items'}
          {activeTab === 'liquorItems' && 'Liquor Items'}
          {activeTab === 'softDrinkItems' && 'Soft Drink Items'}
        </h2>
        {renderTable()}
      </div>
    </div>
  );
};

export default AdminBarManagementPage;