// TableChairArrangement.jsx
import React, { useState, useEffect } from 'react';
import { 
  getAllArrangements,
  getArrangementById,
  createArrangement,
  updateArrangement,
  deleteArrangement
} from '../../services/EventService';
import {
  getAllTableDesigns,
  createTableDesign,
  updateTableDesign,
  deleteTableDesign
} from '../../services/EventService';

function AdminTableChairArrangement() {
  const [arrangements, setArrangements] = useState([]);
  const [tableDesigns, setTableDesigns] = useState([]);
  const [formData, setFormData] = useState({
    Arrangement_ID: '',
    Head_Table_Pax: 10,
    Top_Cloth_Color: '',
    Table_Cloth_Color: '',
    Bow_Color: '',
    Chair_Cover_Color: '',
    reservedTables: [{ tableNumber: '', reserveName: '' }]
  });
  const [designFormData, setDesignFormData] = useState({
    Top_Cloth_Color: '',
    Table_Cloth_Color: '',
    Bow_Color: '',
    Chair_Cover_Color: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [editingDesignId, setEditingDesignId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('arrangements'); // 'arrangements' or 'designs'

  useEffect(() => {
    fetchArrangements();
    fetchTableDesigns();
  }, []);

  const fetchArrangements = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await getAllArrangements();
      setArrangements(data);
    } catch (err) {
      setError(err.message || 'Failed to load arrangements');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTableDesigns = async () => {
    try {
      const data = await getAllTableDesigns();
      setTableDesigns(data);
    } catch (err) {
      setError(err.message || 'Failed to load table designs');
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDesignChange = (e) => {
    const { name, value } = e.target;
    setDesignFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTableChange = (index, e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newTables = [...prev.reservedTables];
      newTables[index] = { ...newTables[index], [name]: value };
      return { ...prev, reservedTables: newTables };
    });
  };

  const addTable = () => {
    setFormData(prev => ({
      ...prev,
      reservedTables: [...prev.reservedTables, { tableNumber: '', reserveName: '' }]
    }));
  };

  const removeTable = (index) => {
    if (formData.reservedTables.length <= 1) return;
    
    setFormData(prev => ({
      ...prev,
      reservedTables: prev.reservedTables.filter((_, i) => i !== index)
    }));
  };

  const handleEdit = async (id) => {
    setIsLoading(true);
    setError('');
    try {
      const arrangement = await getArrangementById(id);
      setFormData({
        Arrangement_ID: arrangement.Arrangement_ID,
        Head_Table_Pax: arrangement.Head_Table_Pax,
        Top_Cloth_Color: arrangement.Top_Cloth_Color,
        Table_Cloth_Color: arrangement.Table_Cloth_Color,
        Bow_Color: arrangement.Bow_Color,
        Chair_Cover_Color: arrangement.Chair_Cover_Color,
        reservedTables: arrangement.reservedTables.map(t => ({
          tableNumber: t.tableNumber,
          reserveName: t.reserveName
        }))
      });
      setEditingId(id);
    } catch (err) {
      setError(err.message || 'Failed to load arrangement details');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDesignEdit = (design) => {
    setDesignFormData({
      Top_Cloth_Color: design.Top_Cloth_Color,
      Table_Cloth_Color: design.Table_Cloth_Color,
      Bow_Color: design.Bow_Color,
      Chair_Cover_Color: design.Chair_Cover_Color
    });
    setEditingDesignId(design.my_row_id);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      Arrangement_ID: '',
      Head_Table_Pax: 10,
      Top_Cloth_Color: '',
      Table_Cloth_Color: '',
      Bow_Color: '',
      Chair_Cover_Color: '',
      reservedTables: [{ tableNumber: '', reserveName: '' }]
    });
  };

  const handleDesignCancelEdit = () => {
    setEditingDesignId(null);
    setDesignFormData({
      Top_Cloth_Color: '',
      Table_Cloth_Color: '',
      Bow_Color: '',
      Chair_Cover_Color: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // Basic validation
      if (!formData.Arrangement_ID) {
        throw new Error('Arrangement ID is required');
      }
      if (formData.reservedTables.some(t => !t.tableNumber || !t.reserveName)) {
        throw new Error('All tables must have a number and reservation name');
      }
      
      if (editingId) {
        await updateArrangement(editingId, formData);
      } else {
        await createArrangement(formData);
      }
      
      handleCancelEdit();
      fetchArrangements();
    } catch (err) {
      setError(err.message || 'Operation failed');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDesignSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      if (editingDesignId) {
        await updateTableDesign(editingDesignId, designFormData);
      } else {
        await createTableDesign(designFormData);
      }
      
      handleDesignCancelEdit();
      fetchTableDesigns();
    } catch (err) {
      setError(err.message || 'Design operation failed');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this arrangement?')) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      await deleteArrangement(id);
      if (editingId === id) handleCancelEdit();
      fetchArrangements();
    } catch (err) {
      setError(err.message || 'Delete failed');
      console.error(err);
      setIsLoading(false);
    }
  };

  const handleDesignDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this design?')) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      await deleteTableDesign(id);
      if (editingDesignId === id) handleDesignCancelEdit();
      fetchTableDesigns();
    } catch (err) {
      setError(err.message || 'Design delete failed');
      console.error(err);
      setIsLoading(false);
    }
  };

  const applyDesign = (design) => {
    setFormData(prev => ({
      ...prev,
      Top_Cloth_Color: design.Top_Cloth_Color,
      Table_Cloth_Color: design.Table_Cloth_Color,
      Bow_Color: design.Bow_Color,
      Chair_Cover_Color: design.Chair_Cover_Color
    }));
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Table & Chair Management</h1>
      
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === 'arrangements'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('arrangements')}
        >
          Arrangements
        </button>
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === 'designs'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('designs')}
        >
          Table Designs
        </button>
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
          <p>{error}</p>
        </div>
      )}
      
      {/* Loading Indicator */}
      {isLoading && (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      {/* Arrangements Tab */}
      {activeTab === 'arrangements' && (
        <>
          {/* Arrangement Form */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              {editingId ? 'Edit Arrangement' : 'Create New Arrangement'}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Arrangement ID */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Arrangement ID *
                  </label>
                  <input
                    type="text"
                    name="Arrangement_ID"
                    value={formData.Arrangement_ID}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={!!editingId}
                    placeholder="e.g., TCA000001"
                  />
                </div>
                
                {/* Head Table Pax */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Head Table Pax *
                  </label>
                  <input
                    type="number"
                    name="Head_Table_Pax"
                    value={formData.Head_Table_Pax}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1"
                    max="50"
                    required
                  />
                </div>
              </div>
              
              {/* Design Selection */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-700 mb-4">Select Table Design</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {tableDesigns.map(design => (
                    <div 
                      key={design.my_row_id}
                      className="border rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => applyDesign(design)}
                    >
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <div>
                          <div className="text-sm text-gray-600">Top Cloth</div>
                          <div className="flex items-center">
                            <div 
                              className="w-5 h-5 rounded-full mr-1 border border-gray-300" 
                              style={{ backgroundColor: design.Top_Cloth_Color }}
                            ></div>
                            <span className="text-sm truncate">{design.Top_Cloth_Color}</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Table Cloth</div>
                          <div className="flex items-center">
                            <div 
                              className="w-5 h-5 rounded-full mr-1 border border-gray-300" 
                              style={{ backgroundColor: design.Table_Cloth_Color }}
                            ></div>
                            <span className="text-sm truncate">{design.Table_Cloth_Color}</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Bow Color</div>
                          <div className="flex items-center">
                            <div 
                              className="w-5 h-5 rounded-full mr-1 border border-gray-300" 
                              style={{ backgroundColor: design.Bow_Color }}
                            ></div>
                            <span className="text-sm truncate">{design.Bow_Color}</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Chair Cover</div>
                          <div className="flex items-center">
                            <div 
                              className="w-5 h-5 rounded-full mr-1 border border-gray-300" 
                              style={{ backgroundColor: design.Chair_Cover_Color }}
                            ></div>
                            <span className="text-sm truncate">{design.Chair_Cover_Color}</span>
                          </div>
                        </div>
                      </div>
                      <button 
                        type="button"
                        className="text-blue-600 text-sm hover:text-blue-800"
                        onClick={(e) => {
                          e.stopPropagation();
                          applyDesign(design);
                        }}
                      >
                        Apply Design
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Color Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Top Cloth Color */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Top Cloth Color *
                  </label>
                  <input
                    type="text"
                    name="Top_Cloth_Color"
                    value={formData.Top_Cloth_Color}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    placeholder="e.g., Gold"
                  />
                </div>
                
                {/* Table Cloth Color */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Table Cloth Color *
                  </label>
                  <input
                    type="text"
                    name="Table_Cloth_Color"
                    value={formData.Table_Cloth_Color}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    placeholder="e.g., White"
                  />
                </div>
                
                {/* Bow Color */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Bow Color *
                  </label>
                  <input
                    type="text"
                    name="Bow_Color"
                    value={formData.Bow_Color}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    placeholder="e.g., Red"
                  />
                </div>
                
                {/* Chair Cover Color */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Chair Cover Color *
                  </label>
                  <input
                    type="text"
                    name="Chair_Cover_Color"
                    value={formData.Chair_Cover_Color}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    placeholder="e.g., Black"
                  />
                </div>
              </div>
              
              {/* Table Reservations Section */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-700 mb-4">Table Reservations *</h3>
                
                {formData.reservedTables.map((table, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 items-end">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Table Number
                      </label>
                      <input
                        type="number"
                        name="tableNumber"
                        value={table.tableNumber}
                        onChange={(e) => handleTableChange(index, e)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="1"
                        required
                        placeholder="e.g., 12"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Reserve Name
                      </label>
                      <input
                        type="text"
                        name="reserveName"
                        value={table.reserveName}
                        onChange={(e) => handleTableChange(index, e)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        placeholder="e.g., John Smith"
                      />
                    </div>
                    
                    <div>
                      <button 
                        type="button" 
                        onClick={() => removeTable(index)}
                        className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
                        disabled={formData.reservedTables.length <= 1}
                      >
                        Remove Table
                      </button>
                    </div>
                  </div>
                ))}
                
                <button 
                  type="button" 
                  onClick={addTable}
                  className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
                >
                  + Add Another Table
                </button>
              </div>
              
              {/* Form Actions */}
              <div className="flex flex-wrap gap-4">
                <button 
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200"
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing...' : (editingId ? 'Update Arrangement' : 'Create Arrangement')}
                </button>
                
                {editingId && (
                  <button 
                    type="button"
                    onClick={handleCancelEdit}
                    className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-6 rounded-lg transition duration-200"
                    disabled={isLoading}
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>
          </div>
          
          {/* Arrangements List */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Existing Arrangements</h2>
            
            {arrangements.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No arrangements found. Create your first arrangement above.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Head Pax</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Top Cloth</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Table Cloth</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bow Color</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chair Cover</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tables</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {arrangements.map(arr => (
                      <tr key={arr.Arrangement_ID} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{arr.Arrangement_ID}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{arr.Head_Table_Pax}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div 
                              className="w-6 h-6 rounded-full mr-2 border border-gray-300" 
                              style={{ backgroundColor: arr.Top_Cloth_Color }}
                            ></div>
                            {arr.Top_Cloth_Color}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div 
                              className="w-6 h-6 rounded-full mr-2 border border-gray-300" 
                              style={{ backgroundColor: arr.Table_Cloth_Color }}
                            ></div>
                            {arr.Table_Cloth_Color}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div 
                              className="w-6 h-6 rounded-full mr-2 border border-gray-300" 
                              style={{ backgroundColor: arr.Bow_Color }}
                            ></div>
                            {arr.Bow_Color}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div 
                              className="w-6 h-6 rounded-full mr-2 border border-gray-300" 
                              style={{ backgroundColor: arr.Chair_Cover_Color }}
                            ></div>
                            {arr.Chair_Cover_Color}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <ul className="space-y-1">
                            {arr.reserved_tables?.split(',').map((table, i) => (
                              <li key={i} className="flex items-center">
                                <span className="font-medium mr-2">Table {table}:</span>
                                <span>{arr.reserve_names?.split(',')[i]}</span>
                              </li>
                            ))}
                          </ul>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(arr.Arrangement_ID)}
                              className="text-blue-600 hover:text-blue-900 font-medium"
                              disabled={isLoading}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(arr.Arrangement_ID)}
                              className="text-red-600 hover:text-red-900 font-medium"
                              disabled={isLoading}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
      
      {/* Table Designs Tab */}
      {activeTab === 'designs' && (
        <>
          {/* Design Form */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              {editingDesignId ? 'Edit Table Design' : 'Create New Table Design'}
            </h2>
            
            <form onSubmit={handleDesignSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Top Cloth Color */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Top Cloth Color *
                  </label>
                  <input
                    type="text"
                    name="Top_Cloth_Color"
                    value={designFormData.Top_Cloth_Color}
                    onChange={handleDesignChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    placeholder="e.g., Gold"
                  />
                </div>
                
                {/* Table Cloth Color */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Table Cloth Color *
                  </label>
                  <input
                    type="text"
                    name="Table_Cloth_Color"
                    value={designFormData.Table_Cloth_Color}
                    onChange={handleDesignChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    placeholder="e.g., White"
                  />
                </div>
                
                {/* Bow Color */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Bow Color *
                  </label>
                  <input
                    type="text"
                    name="Bow_Color"
                    value={designFormData.Bow_Color}
                    onChange={handleDesignChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    placeholder="e.g., Red"
                  />
                </div>
                
                {/* Chair Cover Color */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Chair Cover Color *
                  </label>
                  <input
                    type="text"
                    name="Chair_Cover_Color"
                    value={designFormData.Chair_Cover_Color}
                    onChange={handleDesignChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    placeholder="e.g., Black"
                  />
                </div>
              </div>
              
              {/* Form Actions */}
              <div className="flex flex-wrap gap-4">
                <button 
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200"
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing...' : (editingDesignId ? 'Update Design' : 'Create Design')}
                </button>
                
                {editingDesignId && (
                  <button 
                    type="button"
                    onClick={handleDesignCancelEdit}
                    className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-6 rounded-lg transition duration-200"
                    disabled={isLoading}
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>
          </div>
          
          {/* Designs List */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Existing Table Designs</h2>
            
            {tableDesigns.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No designs found. Create your first design above.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {tableDesigns.map(design => (
                  <div key={design.my_row_id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div>
                        <div className="text-sm text-gray-600">Top Cloth</div>
                        <div className="flex items-center">
                          <div 
                            className="w-6 h-6 rounded-full mr-2 border border-gray-300" 
                            style={{ backgroundColor: design.Top_Cloth_Color }}
                          ></div>
                          <span className="truncate">{design.Top_Cloth_Color}</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Table Cloth</div>
                        <div className="flex items-center">
                          <div 
                            className="w-6 h-6 rounded-full mr-2 border border-gray-300" 
                            style={{ backgroundColor: design.Table_Cloth_Color }}
                          ></div>
                          <span className="truncate">{design.Table_Cloth_Color}</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Bow Color</div>
                        <div className="flex items-center">
                          <div 
                            className="w-6 h-6 rounded-full mr-2 border border-gray-300" 
                            style={{ backgroundColor: design.Bow_Color }}
                          ></div>
                          <span className="truncate">{design.Bow_Color}</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Chair Cover</div>
                        <div className="flex items-center">
                          <div 
                            className="w-6 h-6 rounded-full mr-2 border border-gray-300" 
                            style={{ backgroundColor: design.Chair_Cover_Color }}
                          ></div>
                          <span className="truncate">{design.Chair_Cover_Color}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between pt-3 border-t border-gray-100">
                      <button
                        onClick={() => handleDesignEdit(design)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDesignDelete(design.my_row_id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default AdminTableChairArrangement;