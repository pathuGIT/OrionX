import React, { useState, useEffect, useCallback } from "react";
import moment from "moment";
import {
  calculatePay,
  getPayEntries,
  deductionService,
} from "../../services/UserService";

const Pay = () => {
  const [selectedDate, setSelectedDate] = useState(moment());
  const [payData, setPayData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Format currency values
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 2,
    }).format(value);
  };

  // Show notification message
  const showNotification = useCallback((message, isError = false) => {
    setNotification({ message, isError });
    setTimeout(() => setNotification(null), 5000);
  }, []);

  // Load payroll data
  const loadPayData = useCallback(
    async (date) => {
      try {
        setLoading(true);
        const formattedDate = date || selectedDate.format("YYYY-MM-DD");
        const response = await getPayEntries(formattedDate);

        setPayData(
          response.map((item) => ({
            ...item,
            key: item.employee_id,
          }))
        );
      } catch (error) {
        showNotification(error.message || "Failed to load pay data", true);
      } finally {
        setLoading(false);
      }
    },
    [selectedDate, showNotification]
  );

  // Calculate payroll handler
  const handleCalculate = async () => {
    try {
      setLoading(true);
      const formattedDate = selectedDate.format("YYYY-MM-DD");

      // Calculate deductions first
      await deductionService.calculateAndSaveMonthlyDeduction(
        null,
        formattedDate
      );

      // Calculate payroll
      await calculatePay(formattedDate);

      // Refresh data and show success
      showNotification("Payroll calculated successfully!");
      await loadPayData(formattedDate);
    } catch (error) {
      showNotification(error.message || "Payroll calculation failed", true);
    } finally {
      setLoading(false);
    }
  };

  // Load data on mount and date change
  useEffect(() => {
    loadPayData();
  }, [loadPayData]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      {/* Notification Toast */}
      {notification && (
        <div
          className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg text-white ${
            notification.isError ? "bg-red-500" : "bg-green-500"
          } z-50 animate-slide-in`}
        >
          {notification.message}
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Control Panel */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Month
              </label>
              <input
                type="month"
                value={selectedDate.format("YYYY-MM")}
                onChange={(e) => setSelectedDate(moment(e.target.value))}
                className="w-full sm:w-64 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <button
              onClick={handleCalculate}
              disabled={loading}
              className={`w-full sm:w-auto px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                loading
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                  <span>Calculate Payroll</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Payroll Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Employee
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Basic Salary
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Service Charge
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Charges
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Deductions
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Net Salary
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Date
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {payData.map((item) => (
                  <tr key={item.employee_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {item.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {item.employee_id}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(item.basic_salary)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.service_charge_percentage}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(item.total_service_charge)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                      {formatCurrency(item.total_deduction)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                      {formatCurrency(item.net_salary)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {moment(item.calculation_date).format("DD MMM YYYY")}
                    </td>
                  </tr>
                ))}
              </tbody>

              <tfoot className="bg-gray-50">
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-4 text-right text-sm font-semibold text-gray-900"
                  >
                    Total Net Payroll:{" "}
                    {formatCurrency(
                      payData.reduce(
                        (sum, item) => sum + (Number(item.net_salary) || 0),
                        0
                      )
                    )}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Empty State */}
          {payData.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-2">
                <svg
                  className="mx-auto h-12 w-12"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                  />
                </svg>
              </div>
              <p className="text-gray-500 text-sm">
                No payroll data available for {selectedDate.format("MMMM YYYY")}
              </p>
            </div>
          )}
        </div>

        {/* Loading Overlay */}
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-xl shadow-lg flex items-center gap-4">
              <svg
                className="animate-spin h-8 w-8 text-blue-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span className="text-gray-700">Processing payroll...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pay;
