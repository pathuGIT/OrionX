import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {getAllServiceChargeData} from "../../services/UserService";

const ServiceChargeTable = () => {
    const [serviceChargeData, setServiceChargeData] = useState([]);
    const [loading, setLoading] = useState(true);

    console.log(setLoading);

    useEffect(() => {
        // Fetch service charge data from the backend
        const fetchServiceChargeData = async () => {
            try {
                const response = await axios.get('/user/getAllServiceChargeData'); // Adjust the endpoint as needed
                setServiceChargeData(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching service charge data:', error);
                setLoading(false);
            }
        };

        fetchServiceChargeData();
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold text-center mb-6">Service Charge Data</h1>
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
                        {serviceChargeData.map((row, index) => (
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