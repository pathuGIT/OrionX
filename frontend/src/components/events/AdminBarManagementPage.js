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
        const confirmDelete = window.confirm(`Are you sure you want to delete this item?`);
        if (!confirmDelete) return;

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
            fetchData(); // Refresh data after delete
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
            await updateMap[activeTab](id, updatedData);
            toast.success('Record updated successfully!');
            handleModalClose();
            fetchData(); // Refresh data after update
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
            headers: ["Bite ID", "Event", "Customer", "Date", "Menu Item ID", "Quantity"],
            columns: ["Bite_ID", "eventName", "customerName", "eventDate", "menu_type_id", "Quantity"],
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
        <div className="bg-gray-100 p-8 min-h-screen">
            <header className="mb-6">
                <h1 className="text-4xl font-bold text-gray-800">Bar Service Management</h1>
            </header>
            
            <div className="flex space-x-2 mb-6 border-b">
                {Object.keys(tableConfig).map(tabKey => (
                     <button key={tabKey} onClick={() => setActiveTab(tabKey)}
                        className={`py-2 px-4 text-sm font-medium transition-all ${activeTab === tabKey ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-blue-600'}`}
                     >
                       {tabKey.replace('_', ' ').toUpperCase()}
                     </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <input type="text" placeholder="Filter by Event Name..." value={eventNameFilter} onChange={e => setEventNameFilter(e.target.value)} className="w-full p-2 border rounded-md shadow-sm" />
                <input type="text" placeholder="Filter by Customer Name..." value={customerNameFilter} onChange={e => setCustomerNameFilter(e.target.value)} className="w-full p-2 border rounded-md shadow-sm" />
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {loading && <div className="text-center p-6">Loading...</div>}
                {error && <div className="text-center p-6 text-red-500">{error}</div>}
                {!loading && !error && (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    {currentConfig.headers.map(header => <th key={header} className="p-3 text-left font-semibold text-gray-600">{header}</th>)}
                                    <th className="p-3 text-right font-semibold text-gray-600">ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredRecords.map((record, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        {currentConfig.columns.map(colKey => (
                                            <td key={colKey} className="p-3 whitespace-nowrap">
                                                {colKey.includes('Price') ? formatCurrency(record[colKey]) : colKey.includes('Date') ? formatDate(record[colKey]) : record[colKey]}
                                            </td>
                                        ))}
                                        <td className="p-3 text-right space-x-3 whitespace-nowrap">
                                            <button onClick={() => handleUpdateClick(record)} className="font-medium text-blue-600 hover:text-blue-800">Update</button>
                                            <button onClick={() => handleDeleteClick(record)} className="font-medium text-red-600 hover:text-red-800">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            
            {/* Update Modal */}
            {isModalOpen && (
                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
                        <h2 className="text-2xl font-bold mb-4">Update Record</h2>
                        <form onSubmit={handleUpdateSubmit}>
                            <div className="space-y-4">
                                {Object.entries(currentRecord).map(([key, value]) => (
                                    <div key={key}>
                                        <label className="block text-sm font-medium text-gray-700 capitalize">{key.replace(/_/g, ' ')}</label>
                                        <input
                                            type="text"
                                            name={key}
                                            defaultValue={value ?? ''}
                                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            readOnly={key.includes('ID') || key.includes('Name') || key.includes('Date')} // Make IDs and descriptive names read-only
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 flex justify-end space-x-3">
                                <button type="button" onClick={handleModalClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Save Changes</button>
                            </div>
                        </form>
                    </div>
                 </div>
            )}
        </div>
    );
};

export default AdminBarManagementPage;