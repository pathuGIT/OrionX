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

    const [calculationState, setCalculationState] = useState({
        employee_id: '',
        month: '',
        calculatedTotal: null
    });

    const [editEntryId, setEditEntryId] = useState(null);

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
            let response;
            const operation = editEntryId ? 'update' : 'create';

            if (editEntryId) {
                response = await deductionService.updateDeduction(editEntryId, formData);
            } else {
                response = await deductionService.createDeduction(formData);
            }

            if (response.success) {
                alert(`Success: Deduction ${operation}d!`);
                const entriesRes = await deductionService.getAllDeductionEntries();
                if (entriesRes.success) setEntries(entriesRes.data);

                setFormData({
                    employee_id: '',
                    calculation_date: '',
                    description: '',
                    amount: ''
                });
                setEditEntryId(null);
            } else {
                alert(response.message || `Failed to ${operation} deduction`);
            }
        } catch (error) {
            console.error('Error saving deduction:', error);
            alert(`Error: Failed to ${editEntryId ? 'update' : 'create'} deduction`);
        }
    };

    const handleEdit = (entry) => {
        setFormData({
            employee_id: entry.employee_id,
            calculation_date: new Date(entry.calculation_date).toISOString().split('T')[0],
            description: entry.description,
            amount: entry.total_deductions
        });
        setEditEntryId(entry.deductions_id);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this deduction?')) {
            try {
                const response = await deductionService.deleteDeduction(id);
                if (response.success) {
                    alert('Deduction deleted successfully');
                    const entriesRes = await deductionService.getAllDeductionEntries();
                    if (entriesRes.success) setEntries(entriesRes.data);
                }
            } catch (error) {
                console.error('Error deleting deduction:', error);
                alert(error.message || 'Error deleting deduction');
            }
        }
    };

    // const handleCalculate = async () => {
    //     if (!calculationState.employee_id || !calculationState.month) {
    //         alert('Please select an employee and a month.');
    //         return;
    //     }

    //     try {
    //         const response = await deductionService.calculateMonthlyDeduction(
    //             calculationState.employee_id,
    //             calculationState.month
    //         );

    //         if (response.success) {
    //             setCalculationState((prev) => ({
    //                 ...prev,
    //                 calculatedTotal: response.data.total_deduction
    //             }));
    //         } else {
    //             alert(response.message || 'Failed to calculate monthly deduction');
    //         }
    //     } catch (error) {
    //         console.error('Calculation error:', error);
    //         alert('Error calculating monthly deduction');
    //     }
    // };

    const handleSaveMonthlyDeduction = async () => {
        if (!calculationState.calculatedTotal) {
            alert('Please calculate the deduction before saving.');
            return;
        }

        try {
            const response = await deductionService.saveMonthlyDeduction({
                employee_id: calculationState.employee_id,
                month_year: calculationState.month,
                total_deduction: calculationState.calculatedTotal
            });

            if (response.success) {
                alert('Monthly deduction saved successfully!');
                setCalculationState({
                    employee_id: '',
                    month: '',
                    calculatedTotal: null
                });
            } else {
                alert(response.message || 'Failed to save monthly deduction');
            }
        } catch (error) {
            console.error('Save error:', error);
            alert('Error saving monthly deduction');
        }
    };

//aulaa.................................

const handleCalculate = async () => {
  if (!calculationState.employee_id || !calculationState.month) {
      alert('Please select an employee and a month.');
      return;
  }

  try {
      const response = await deductionService.calculateAndSaveMonthlyDeduction(
          calculationState.employee_id,
          calculationState.month
      );

      if (response.success) {
          alert(response.message);

          calculationState:''

        
      } else {
          alert(response.message || 'Failed to calculate and save monthly deduction');
      }
  } catch (error) {
      console.error('Error:', error);
      alert('Error calculating and saving monthly deduction');
  }
};







    return (
        <div className="min-h-screen p-6 w-full bg-gray-100">
            <div className="mx-auto w-full flex flex-col" style={{ maxWidth: '95%' }}>
                <h1 className="text-2xl font-bold mb-6">
                    {editEntryId ? 'Edit Deduction' : 'Add New Deduction'}
                </h1>

                {/* Deduction Form */}
                <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg mb-6 w-full shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Employee</label>
                            <select
                                value={formData.employee_id}
                                onChange={(e) =>
                                    setFormData({ ...formData, employee_id: e.target.value })
                                }
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="">Select Employee</option>
                                {employees.map((emp) => (
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
                                onChange={(e) =>
                                    setFormData({ ...formData, calculation_date: e.target.value })
                                }
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-1">Description</label>
                            <input
                                type="text"
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({ ...formData, description: e.target.value })
                                }
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Amount (LKR)</label>
                            <input
                                type="number"
                                value={formData.amount}
                                onChange={(e) =>
                                    setFormData({ ...formData, amount: e.target.value })
                                }
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                                step="0.01"
                                required
                            />
                        </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                        >
                            {editEntryId ? 'Update Deduction' : 'Save Deduction'}
                        </button>
                        {editEntryId && (
                            <button
                                type="button"
                                onClick={() => {
                                    setFormData({
                                        employee_id: '',
                                        calculation_date: '',
                                        description: '',
                                        amount: ''
                                    });
                                    setEditEntryId(null);
                                }}
                                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
                            >
                                Cancel Edit
                            </button>
                        )}
                    </div>
                </form>

                {/* Monthly Deduction Calculation */}
                <div className="bg-white p-4 rounded-lg mb-6 shadow-sm">
                    <h2 className="text-xl font-semibold mb-4">Calculate Monthly Deductions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Employee</label>
                            <select
                                value={calculationState.employee_id}
                                onChange={(e) =>
                                    setCalculationState((prev) => ({
                                        ...prev,
                                        employee_id: e.target.value
                                    }))
                                }
                                className="w-full p-2 border rounded"
                            >
                                <option value="">Select Employee</option>
                                {employees.map((emp) => (
                                    <option key={emp.employee_id} value={emp.employee_id}>
                                        {emp.name} ({emp.employee_id})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Month</label>
                            <input
                                type="month"
                                value={calculationState.month}
                                onChange={(e) =>
                                    setCalculationState((prev) => ({
                                        ...prev,
                                        month: e.target.value
                                    }))
                                }
                                className="w-full p-2 border rounded"
                            />
                        </div>

                        <div className="flex items-end">
                            <button
                                type="button"
                                onClick={handleCalculate}
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                            >
                                Calculate
                            </button>
                        </div>
                    </div>

                    {calculationState.calculatedTotal !== null && (
                        <div className="mt-4 p-4 bg-gray-50 rounded">
                            <div className="flex items-center gap-4">
                                <h3 className="text-lg font-semibold">
                                    Total Deduction: LKR{' '}
                                    {calculationState.calculatedTotal.toFixed(2)}
                                </h3>
                                <button
                                    type="button"
                                    onClick={handleSaveMonthlyDeduction}
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                >
                                    Save Monthly Deduction
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Deductions Table */}
                <div className="bg-white rounded-lg shadow overflow-auto w-full flex-1">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Employee ID
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Date
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Description
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Amount (LKR)
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {entries.map((entry) => (
                                <tr key={entry.deductions_id}>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                                        {entry.employee_id}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                                        {new Date(entry.calculation_date).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                                        {entry.description}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                                        {new Intl.NumberFormat('en-LK', {
                                            style: 'currency',
                                            currency: 'LKR'
                                        }).format(entry.total_deductions)}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => handleEdit(entry)}
                                                className="text-blue-600 hover:text-blue-900 px-2 py-1 rounded transition-colors"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(entry.deductions_id)}
                                                className="text-red-600 hover:text-red-900 px-2 py-1 rounded transition-colors"
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
            </div>
        </div>
    );
};

export default DeductionsPage;