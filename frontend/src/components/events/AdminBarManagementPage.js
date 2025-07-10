import React, { useState, useEffect, useMemo } from 'react';
import {
    // Assuming you have API service functions like these
    getAllBarTimes, updateBarTime, deleteBarTime,
    getAllBites, updateBite, deleteBite,
    getAllLiquorItems, updateLiquorItem, deleteLiquorItem,
    getAllSoftDrinkItems, updateSoftDrinkItem, deleteSoftDrinkItem
} from '../../services/EventService';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// --- Helper Functions for Formatting ---
const formatCurrency = (amount) => {
    if (amount === null || isNaN(amount)) return 'N/A';
    return new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }).format(amount);
};

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-CA'); // YYYY-MM-DD format
};

// --- Component ---
const AdminBarManagementPage = () => {
    const [activeTab, setActiveTab] = useState('bar');
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // State for Update Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentRecord, setCurrentRecord] = useState(null);

    // State for Filters
    const [eventNameFilter, setEventNameFilter] = useState('');
    const [customerNameFilter, setCustomerNameFilter] = useState('');

    // --- Data Fetching ---
    const fetchData = async () => {
        setLoading(true);
        setError('');
        try {
            const fetchMap = {
                bar: getAllBarTimes,
                bite: getAllBites,
                liquor: getAllLiquorItems,
                soft_drink: getAllSoftDrinkItems,
            };
            const data = await fetchMap[activeTab]();
            setRecords(data);
        } catch (err) {
            setError(`Failed to fetch data: ${err.message}`);
            toast.error(`Failed to fetch data: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    // --- Filtering ---
    const filteredRecords = useMemo(() => {
        const lowerEventFilter = eventNameFilter.toLowerCase();
        const lowerCustomerFilter = customerNameFilter.toLowerCase();

        return records.filter(record => {
            const eventMatch = record.eventName?.toLowerCase().includes(lowerEventFilter) ?? true;
            const customerMatch = record.customerName?.toLowerCase().includes(lowerCustomerFilter) ?? true;
            return eventMatch && customerMatch;
        });
    }, [records, eventNameFilter, customerNameFilter]);

    // --- Handlers ---
    const handleUpdateClick = (record) => {
        setCurrentRecord(record);
        setIsModalOpen(true);
    };

    const handleDeleteClick = async (record) => {
        if (!await showConfirmationModal('Are you sure you want to delete this item?')) return;

        try {
            const id = record.id || record.BarRequirementID || record.Liquor_ID || record.Soft_Drink_id;
            const deleteMap = {
                bar: deleteBarTime,
                bite: deleteBite,
                liquor: deleteLiquorItem,
                soft_drink: deleteSoftDrinkItem,
            };
            await deleteMap[activeTab](id);
            toast.success('Record deleted successfully!');
            fetchData();
        } catch (err) {
            toast.error(`Failed to delete record: ${err.message}`);
        }
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setCurrentRecord(null);
    };
    
    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const updatedData = Object.fromEntries(formData.entries());

        try {
            const id = currentRecord.id || currentRecord.BarRequirementID || currentRecord.Liquor_ID || currentRecord.Soft_Drink_id;
            const updateMap = {
                bar: updateBarTime,
                bite: updateBite,
                liquor: updateLiquorItem,
                soft_drink: updateSoftDrinkItem,
            };
            
            // For the 'bite' tab, only send the quantity
            const payload = activeTab === 'bite' ? { Quantity: updatedData.Quantity } : updatedData;

            await updateMap[activeTab](id, payload);
            toast.success('Record updated successfully!');
            handleModalClose();
            fetchData();
        } catch (err) {
            toast.error(`Failed to update record: ${err.message}`);
        }
    };

    // --- Dynamic Table Configuration ---
    const tableConfig = {
        bar: {
            headers: ["Bar ID", "Event", "Customer", "Date", "From", "To", "PAX", "Bite Price", "Liquor Price", "Soft Drink Price"],
            columns: ["BarRequirementID", "eventName", "customerName", "eventDate", "LiquorTimeFrom", "LiquorTimeTo", "BarPax", "TotalBitePrice", "TotalLiquorPrice", "TotalSoftDrinkPrice"],
        },
        bite: {
            headers: ["Bite ID", "Event", "Customer", "Date", "Menu Item", "Quantity"],
            columns: ["Bite_ID", "eventName", "customerName", "eventDate", "menu_type_name", "Quantity"],
        },
        liquor: {
            headers: ["Liquor ID", "Event", "Customer", "Date", "Item Name", "Quantity", "Usage", "Price"],
            columns: ["Liquor_ID", "eventName", "customerName", "eventDate", "item_name", "quantity", "usages", "LiquorPrice"],
        },
        soft_drink: {
            headers: ["Soft Drink ID", "Event", "Customer", "Date", "Drink Name", "Quantity", "Usage", "Price"],
            columns: ["Soft_Drink_id", "eventName", "customerName", "eventDate", "Soft_Drink_name", "quantity", "usages", "DrinkPrice"],
        },
    };
    
    const currentConfig = tableConfig[activeTab];

    // --- Render ---
   return (
        <div className="bg-gray-100 p-4 sm:p-6 md:p-8 min-h-screen">
            <header className="mb-4 sm:mb-6">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">Bar Service Management</h1>
            </header>
            
            <div className="mb-4 sm:mb-6">
                <div className="flex overflow-x-auto pb-1 -mb-px hide-scrollbar">
                    {Object.keys(tableConfig).map(tabKey => (
                        <button 
                            key={tabKey} 
                            onClick={() => setActiveTab(tabKey)}
                            className={`py-2 px-3 sm:px-4 text-xs sm:text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                                activeTab === tabKey 
                                    ? 'border-b-2 border-blue-600 text-blue-600' 
                                    : 'text-gray-500 hover:text-blue-600'
                            }`}
                        >
                            {tabKey.replace('_', ' ').toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mb-4 sm:mb-6">
                <input 
                    type="text" 
                    placeholder="Filter by Event..." 
                    value={eventNameFilter} 
                    onChange={e => setEventNameFilter(e.target.value)} 
                    className="flex-grow p-2 border rounded-md shadow-sm text-sm sm:text-base"
                />
                <input 
                    type="text" 
                    placeholder="Filter by Customer..." 
                    value={customerNameFilter} 
                    onChange={e => setCustomerNameFilter(e.target.value)} 
                    className="flex-grow p-2 border rounded-md shadow-sm text-sm sm:text-base"
                />
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {loading && <div className="text-center p-6">Loading...</div>}
                {error && <div className="text-center p-6 text-red-500">{error}</div>}
                
                {!loading && !error && (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-xs sm:text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    {currentConfig.headers.map(header => (
                                        <th key={header} className="p-2 sm:p-3 text-left font-semibold text-gray-600 whitespace-nowrap">
                                            {header}
                                        </th>
                                    ))}
                                    <th className="p-2 sm:p-3 text-right font-semibold text-gray-600">ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredRecords.map((record, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        {currentConfig.columns.map(colKey => (
                                            <td key={colKey} className="p-2 sm:p-3 whitespace-nowrap">
                                                {colKey.includes('Price') 
                                                    ? formatCurrency(record[colKey]) 
                                                    : colKey.includes('Date') 
                                                        ? formatDate(record[colKey]) 
                                                        : (record[colKey] === null || record[colKey] === undefined) ? 'N/A' : record[colKey]}
                                            </td>
                                        ))}
                                        <td className="p-2 sm:p-3 text-right space-x-2 whitespace-nowrap">
                                            <button onClick={() => handleUpdateClick(record)} className="text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-800">
                                                Update
                                            </button>
                                            <button onClick={() => handleDeleteClick(record)} className="text-xs sm:text-sm font-medium text-red-600 hover:text-red-800">
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            
            {/* MODAL: Updated to be conditional */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <div className="p-4 sm:p-6">
                            <h2 className="text-xl sm:text-2xl font-bold mb-4">Update Record</h2>
                            <form onSubmit={handleUpdateSubmit}>
                                <div className="space-y-4">
                                    {/* Conditional form rendering */}
                                    {activeTab === 'bite' ? (
                                        <>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Menu Item</label>
                                                <input
                                                    type="text"
                                                    value={currentRecord?.menu_type_name || 'N/A'}
                                                    className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm text-sm sm:text-base"
                                                    readOnly
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="Quantity" className="block text-sm font-medium text-gray-700">Quantity</label>
                                                <input
                                                    id="Quantity"
                                                    type="number"
                                                    name="Quantity"
                                                    defaultValue={currentRecord?.Quantity ?? ''}
                                                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                                                    required
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        // Original generic form for other tabs
                                        Object.entries(currentRecord).map(([key, value]) => (
                                            <div key={key}>
                                                <label className="block text-sm font-medium text-gray-700 capitalize">
                                                    {key.replace(/_/g, ' ')}
                                                </label>
                                                <input
                                                    type="text"
                                                    name={key}
                                                    defaultValue={value ?? ''}
                                                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                                                    readOnly={key.includes('ID') || key.includes('Name') || key.includes('Date') || key.includes('_name')}
                                                />
                                            </div>
                                        ))
                                    )}
                                </div>
                                <div className="mt-6 flex flex-col sm:flex-row sm:space-x-3 space-y-3 sm:space-y-0">
                                    <button type="button" onClick={handleModalClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 text-sm sm:text-base flex-1">
                                        Cancel
                                    </button>
                                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm sm:text-base flex-1">
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
};

const showConfirmationModal = (message) => {
  return new Promise((resolve) => {
    const confirmed = window.confirm(message);
    resolve(confirmed);
  });
};

export default AdminBarManagementPage;
