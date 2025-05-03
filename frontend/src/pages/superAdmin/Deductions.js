import React, { useEffect, useState } from 'react';
import { deductionService } from '../../services/UserService';

const DeductionsPage = () => {
  const [deductions, setDeductions] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [totalDeductions, setTotalDeductions] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const { data } = await deductionService.getAllDeductions();
      setDeductions(data);
      calculateTotals(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotals = (data) => {
    const total = data.reduce((sum, deduction) => 
      sum + deduction.details.reduce((dSum, d) => dSum + d.amount, 0), 0);
    setTotalDeductions(total);
  };

  useEffect(() => {
    loadData();
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 2
    }).format(value);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Employee Deductions</h1>
        <div className="bg-red-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-red-600">
            Total Deductions: {formatCurrency(totalDeductions)}
          </h3>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">Calculation Date</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Total Amount</th>
              <th className="px-6 py-3 text-left">Employees</th>
            </tr>
          </thead>
          <tbody>
            {deductions.map(deduction => (
              <tr key={deduction.id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4">
                  {new Date(deduction.calculation_date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded ${
                    deduction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    deduction.status === 'processed' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {deduction.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-red-600">
                  {formatCurrency(deduction.total_deductions)}
                </td>
                <td className="px-6 py-4">
                  {deduction.employee_count} employees
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