import React, { useEffect, useState } from 'react';
import { deductionService, getEmployees } from '../../services/UserService';

const DeductionsPage = () => {
    const [entries, setEntries] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [formData, setFormData] = useState({
        employee_id: '',
        calculation_date: '',
        description: '',
        amount: ''
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                const [entriesRes, employeesRes] = await Promise.all([
                    deductionService.getAllDeductionEntries(),
                    getEmployees()
                ]);

                if (entriesRes.success) setEntries(entriesRes.data);
                  setEmployees(employeesRes.employees);
            } catch (error) {
                console.error('Error loading data:', error);
                alert('Error loading initial data');
            }
        };
        loadData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          //aulaaaaaa
            const response = await deductionService.createDeduction(formData);
           

            if (response.success) {
                alert("Success: Deduction added!");
                
                // Refresh entries
                const entriesRes = await deductionService.getAllDeductionEntries();
                if (entriesRes.success) setEntries(entriesRes.data);
                
                // Reset form
                setFormData({
                    employee_id: '',
                    calculation_date: '',
                    description: '',
                    amount: ''
                });
            }
        } catch (error) {
            console.error('Error creating deduction:', error);
            alert("Error: Failed to create deduction");
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Employee Deductions</h1>
            
            {/* Deduction Form */}
            <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Employee</label>
                        <select
                            value={formData.employee_id}
                            onChange={e => setFormData({...formData, employee_id: e.target.value})}
                            className="w-full p-2 border rounded"
                            required
                        >
                            <option value="">Select Employee</option>
                            {employees.map(emp => (
                                <option key={emp.employee_id} value={emp.employee_id}>
                                    {emp.name} ({emp.employee_id})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Date</label>
                        <input
                            type="date"
                            value={formData.calculation_date}
                            onChange={e => setFormData({...formData, calculation_date: e.target.value})}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <input
                            type="text"
                            value={formData.description}
                            onChange={e => setFormData({...formData, description: e.target.value})}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Amount (LKR)</label>
                        <input
                            type="number"
                            value={formData.amount}
                            onChange={e => setFormData({...formData, amount: e.target.value})}
                            className="w-full p-2 border rounded"
                            step="0.01"
                            required
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Save Deduction
                </button>
            </form>

            {/* Deductions Table */}
            <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount (LKR)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {entries.map((entry, index) => (
                            <tr key={index}>
                                <td className="px-6 py-4 whitespace-nowrap">{entry.employee_id}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {new Date(entry.calculation_date).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">{entry.description}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {new Intl.NumberFormat('en-LK', {
                                        style: 'currency',
                                        currency: 'LKR'
                                    }).format(entry.total_deductions)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DeductionsPage;