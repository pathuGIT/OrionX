import React, { useEffect, useState } from 'react';
import { getAllServiceChargeData } from '../../services/UserService';

const ServiceChargeTable = () => {
    const [serviceChargeData, setServiceChargeData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMonth, setSelectedMonth] = useState(''); // State for selected month

    useEffect(() => {
        const fetchServiceChargeData = async () => {
            try {
                const response = await getAllServiceChargeData(); // Use the imported function
                console.log('Fetched Data:', response); // Log the fetched data
                const data = Array.isArray(response) ? response : [];
                setServiceChargeData(data); // Set the full data
                setFilteredData(data); // Initially, show all data
                setLoading(false);
            } catch (error) {
                console.error('Error fetching service charge data:', error);
                setLoading(false);
            }
        };

        fetchServiceChargeData();
    }, []);

    // Filter data based on the selected month
    useEffect(() => {
        if (selectedMonth === '') {
            setFilteredData(serviceChargeData); // Show all data if no month is selected
        } else {
            const filtered = serviceChargeData.filter((row) => {
                const eventDate = new Date(row.Date); // Convert the date string to a Date object
                return eventDate.getMonth() + 1 === parseInt(selectedMonth); // Match the month (getMonth() is 0-based)
            });
            setFilteredData(filtered);
        }
    }, [selectedMonth, serviceChargeData]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!Array.isArray(filteredData) || filteredData.length === 0) {
        return <p>No data available</p>;
    }

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold text-center mb-6">Service Charge Data</h1>

            {/* Month Selector */}
            <div className="mb-6">
                <label htmlFor="monthSelect" className="block text-lg font-medium mb-2">
                    Select Month:
                </label>
                <select
                    id="monthSelect"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">All Months</option>
                    <option value="1">January</option>
                    <option value="2">February</option>
                    <option value="3">March</option>
                    <option value="4">April</option>
                    <option value="5">May</option>
                    <option value="6">June</option>
                    <option value="7">July</option>
                    <option value="8">August</option>
                    <option value="9">September</option>
                    <option value="10">October</option>
                    <option value="11">November</option>
                    <option value="12">December</option>
                </select>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 border-b">Service Charge ID</th>
                            <th className="px-4 py-2 border-b">Employee ID</th>
                            <th className="px-4 py-2 border-b">Employee Name</th>
                            <th className="px-4 py-2 border-b">Service Charge %</th>
                            <th className="px-4 py-2 border-b">Base Amount</th>
                            <th className="px-4 py-2 border-b">Service Charge Amount</th>
                            <th className="px-4 py-2 border-b">Event Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((row, index) => (
                            <tr key={index} className="text-center">
                                <td className="px-4 py-2 border-b">{row.services_charge_id}</td>
                                <td className="px-4 py-2 border-b">{row.employee_id}</td>
                                <td className="px-4 py-2 border-b">{row.name}</td>
                                <td className="px-4 py-2 border-b">{row.service_charge_precentage}%</td>
                                <td className="px-4 py-2 border-b">Rs {row.base_amount}</td>
                                <td className="px-4 py-2 border-b">Rs {row.service_charge_amount}</td>
                                <td className="px-4 py-2 border-b">{row.Date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ServiceChargeTable;