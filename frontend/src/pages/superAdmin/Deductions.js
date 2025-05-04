import React, { useEffect, useState, useCallback } from 'react';
import { deductionService } from '../../services/UserService';

const DeductionsPage = () => {
  const [deductions, setDeductions] = useState([]);
  const [totalDeductions, setTotalDeductions] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 2
    }).format(value);
  };

  const calculateTotals = useCallback((data) => {
    const total = data.reduce((sum, deduction) => 
      sum + (deduction.details?.reduce((dSum, d) => dSum + d.amount, 0) || 0), 0);
    setTotalDeductions(total);
  }, []);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await deductionService.getAllDeductions();
      if (response.success) {
        setDeductions(response.data);
        calculateTotals(response.data);
      } else {
        setError(response.message || 'Failed to load deductions');
      }
    } catch (error) {
      setError(error.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }, [calculateTotals]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading deductions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        <p className="mb-4">{error}</p>
        <button
          onClick={loadData}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Employee Deductions</h1>
        <div className="bg-red-100 p-4 rounded-lg w-full md:w-auto">
          <h3 className="text-lg font-semibold text-red-600">
            Total Deductions: {formatCurrency(totalDeductions)}
          </h3>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Calculation Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Employees
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {deductions.map((deduction) => (
              <tr key={deduction.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(deduction.calculation_date).toLocaleDateString('en-GB', {
                    year: 'numeric',
                    month: 'long'
                  })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2.5 py-1.5 rounded-full text-sm font-medium ${
                      deduction.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : deduction.status === 'processed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {deduction.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-red-600 font-medium">
                  {formatCurrency(deduction.total_deductions)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-1.5 rounded">
                    {deduction.employee_count} employees
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {deductions.length === 0 && !loading && (
        <div className="mt-8 text-center text-gray-500">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <p className="mt-2">No deductions found</p>
        </div>
      )}
    </div>
  );
};

export default DeductionsPage;