import React, { useEffect, useState } from 'react';
import { getAllServiceChargeData } from '../../services/UserService';

const ServiceChargeTable = () => {
    const [serviceChargeData, setServiceChargeData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMonth, setSelectedMonth] = useState('');
    const [totalDistributed, setTotalDistributed] = useState(0);

    useEffect(() => {
        const fetchServiceChargeData = async () => {
            try {
                const response = await getAllServiceChargeData();
                const data = Array.isArray(response) ? response : [];
                
                // Calculate total distributed once on load
                const total = data.reduce((sum, item) => 
                    sum + parseFloat(item.service_charge_amount || 0), 0);
                
                setServiceChargeData(data);
                setFilteredData(data);
                setTotalDistributed(total);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching service charge data:', error);
                setLoading(false);
            }
        };

        fetchServiceChargeData();
    }, []);

    useEffect(() => {
        const filterData = () => {
            if (selectedMonth === '') {
                setFilteredData(serviceChargeData);
                setTotalDistributed(
                    serviceChargeData.reduce((sum, item) => 
                        sum + parseFloat(item.service_charge_amount || 0), 0)
                );
            } else {
                const filtered = serviceChargeData.filter((row) => {
                    const eventDate = new Date(row.date);
                    return eventDate.getMonth() + 1 === parseInt(selectedMonth);
                });
                
                setFilteredData(filtered);
                setTotalDistributed(
                    filtered.reduce((sum, item) => 
                        sum + parseFloat(item.service_charge_amount || 0), 0)
                );
            }
        };

        filterData();
    }, [selectedMonth, serviceChargeData]);

    const formatCurrency = (value) => {
        return parseFloat(value || 0).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    if (loading) {
        return (
            <div className="p-6 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading service charge data...</p>
            </div>
        );
    }

    if (!Array.isArray(filteredData) || filteredData.length === 0) {
        return (
            <div className="p-6 text-center">
                <p className="text-gray-600">No service charge records found</p>
                {serviceChargeData.length > 0 && (
                    <button 
                        onClick={() => setSelectedMonth('')}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Clear Filters
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold text-center mb-6">Service Charge Distribution Report</h1>

            {/* Controls Section */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="w-full sm:w-64">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Filter by Month:
                    </label>
                    <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        className="w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">All Months</option>
                        {Array.from({length: 12}, (_, i) => (
                            <option key={i+1} value={i+1}>
                                {new Date(0, i).toLocaleString('default', {month: 'long'})}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Summary Cards */}
                <div className="w-full sm:w-auto grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="text-sm font-medium text-gray-500">Total Distributed</h3>
                        <p className="mt-1 text-xl font-semibold text-green-600">
                            LKR {formatCurrency(totalDistributed)}
                        </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="text-sm font-medium text-gray-500">Total Records</h3>
                        <p className="mt-1 text-xl font-semibold text-blue-600">
                            {filteredData.length}
                        </p>
                    </div>
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {[
                                'SC ID', 'Employee ID', 'Event ID', 
                                'Role', 'Charge %', 'Base Amount', 
                                'Service Charge', 'Date'
                            ].map((header, idx) => (
                                <th 
                                    key={idx}
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredData.map((row, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {row.services_charge_id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                                    {row.employee_id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {row.event_id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {row.User_Role}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {row.service_charge_precentage}%
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    LKR {formatCurrency(row.base_amount)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                                    LKR {formatCurrency(row.service_charge_amount)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(row.date).toLocaleDateString('en-GB', {
                                        day: '2-digit',
                                        month: 'short',
                                        year: 'numeric'
                                    })}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ServiceChargeTable;