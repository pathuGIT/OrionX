import React, { useEffect, useState } from 'react';
import { getPaymentHistory } from '../../services/UserService';
import moment from 'moment';
import { FaSearch, FaFilePdf } from 'react-icons/fa';
import { jsPDF } from 'jspdf';
import autoTable from "jspdf-autotable";

const PaymentHistory = () => {
  const [history, setHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    employee: '',
    month: '',
    year: ''
  });

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const { success, data, message } = await getPaymentHistory();
        if (success) {
          setHistory(data);
          setFilteredHistory(data);
        } else {
          setError(message || 'Failed to load payment history');
        }
      } catch (err) {
        setError('Network error. Please try again later.');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  useEffect(() => {
    let results = history;
    
    // Apply search filter
    if (searchTerm) {
      results = results.filter(item => 
        item.employee_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.employee_id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply filters
    if (filters.employee) {
      results = results.filter(item => 
        item.employee_id === filters.employee
      );
    }
    
    if (filters.month) {
      results = results.filter(item => 
        moment(item.calculation_date).format('M') === filters.month
      );
    }
    
    if (filters.year) {
      results = results.filter(item => 
        moment(item.calculation_date).format('YYYY') === filters.year
      );
    }
    
    setFilteredHistory(results);
  }, [searchTerm, filters, history]);

  const formatCurrency = (value) => {
    return `LKR ${parseFloat(value).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  const handleExport = () => {
    // Create new PDF document in landscape mode
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'pt',
      format: 'a4'
    });

    // Add title
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text('Payment History Report', doc.internal.pageSize.getWidth() / 2, 40, { align: 'center' });
    
    // Add report date
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text(`Generated on: ${moment().format('DD MMM YYYY hh:mm A')}`, doc.internal.pageSize.getWidth() / 2, 60, { align: 'center' });
    
    // Add filter information
    let filterInfo = 'Filters: ';
    let hasFilters = false;
    
    if (filters.employee) {
      const employee = history.find(e => e.employee_id === filters.employee);
      filterInfo += `Employee: ${employee?.employee_name || filters.employee} `;
      hasFilters = true;
    }
    
    if (filters.month) {
      filterInfo += `| Month: ${moment().month(filters.month - 1).format('MMMM')} `;
      hasFilters = true;
    }
    
    if (filters.year) {
      filterInfo += `| Year: ${filters.year} `;
      hasFilters = true;
    }
    
    if (searchTerm) {
      filterInfo += `| Search: "${searchTerm}"`;
      hasFilters = true;
    }
    
    if (hasFilters) {
      doc.setFontSize(9);
      doc.text(filterInfo, 40, 80, { maxWidth: doc.internal.pageSize.getWidth() - 80 });
    }

    // Prepare table data
    const headers = [
      'Employee ID',
      'Name',
      'Period',
      'Base Salary',
      'Service Charge',
      'Deductions',
      'Net Salary',
      'Payment Date'
    ];
    
    const data = filteredHistory.map(item => [
      item.employee_id,
      item.employee_name,
      moment(item.calculation_date).format('MMM YYYY'),
      formatCurrency(item.basic_salary),
      formatCurrency(item.total_service_charge),
      formatCurrency(item.total_deduction),
      formatCurrency(item.net_salary),
      moment(item.calculation_date).format('DD MMM YYYY')
    ]);

    // Generate table
    autoTable(doc, {
      head: [headers],
      body: data,
      startY: hasFilters ? 100 : 80,
      theme: 'grid',
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold',
        fontSize: 10
      },
      bodyStyles: {
        fontSize: 9
      },
      styles: {
        cellPadding: 3,
        valign: 'middle'
      },
      columnStyles: {
        0: { cellWidth: 70 },
        1: { cellWidth: 90 },
        2: { cellWidth: 60 },
        3: { cellWidth: 70 },
        4: { cellWidth: 70 },
        5: { cellWidth: 70 },
        6: { cellWidth: 70 },
        7: { cellWidth: 70 }
      },
      margin: { left: 40, right: 40 }
    });

    // Add page numbers
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(9);
      doc.text(
        `Page ${i} of ${pageCount}`, 
        doc.internal.pageSize.getWidth() - 40, 
        doc.internal.pageSize.getHeight() - 20
      );
    }

    // Save the PDF
    doc.save(`payment_history_${moment().format('YYYYMMDD_HHmmss')}.pdf`);
  };

  // Get unique years from history
  const uniqueYears = [...new Set(history.map(item => 
    moment(item.calculation_date).format('YYYY'))
  )].sort((a, b) => b - a);

  // Get unique employees
  const employeeMap = new Map();
  history.forEach(item => {
    if (!employeeMap.has(item.employee_id)) {
      employeeMap.set(item.employee_id, item.employee_name);
    }
  });
  
  const uniqueEmployees = Array.from(employeeMap, ([id, name]) => ({
    id,
    name: `${id} - ${name}`
  })).sort((a, b) => a.name.localeCompare(b.name));

  // Group by month-year
  const groupByMonthYear = (data) => {
    return data.reduce((groups, item) => {
      const key = moment(item.calculation_date).format('MMMM YYYY');
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
      return groups;
    }, {});
  };

  // Sort groups by date (newest first)
  const getSortedGroups = (groupedData) => {
    return Object.entries(groupedData)
      .sort(([aKey], [bKey]) => 
        moment(bKey, 'MMMM YYYY').diff(moment(aKey, 'MMMM YYYY'))
      );
  };

  // Array of light background colors for monthly sections
  const monthColors = [
    'bg-blue-50',    // January
    'bg-purple-50',  // February
    'bg-pink-50',    // March
    'bg-green-50',   // April
    'bg-yellow-50',  // May
    'bg-indigo-50',  // June
    'bg-red-50',     // July
    'bg-orange-50',  // August
    'bg-teal-50',    // September
    'bg-cyan-50',    // October
    'bg-amber-50',   // November
    'bg-lime-50'     // December
  ];

  const getMonthColor = (monthName) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const monthIndex = months.findIndex(m => m === monthName.split(' ')[0]);
    return monthColors[monthIndex] || 'bg-gray-50';
  };

  const groupedData = groupByMonthYear(filteredHistory);
  const sortedGroups = getSortedGroups(groupedData);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-3xl mx-auto" role="alert">
        <strong className="font-bold">Error! </strong>
        <span className="block sm:inline">{error}</span>
        <button 
          onClick={() => window.location.reload()} 
          className="ml-4 mt-2 sm:mt-0 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Payment History</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div className="relative flex-grow max-w-lg">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search by employee name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <button
            onClick={handleExport}
            disabled={filteredHistory.length === 0}
            className={`flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium ${
              filteredHistory.length === 0
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            }`}
          >
            <FaFilePdf className="mr-2" />
            Export to PDF
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Employee</label>
            <select
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={filters.employee}
              onChange={(e) => setFilters({...filters, employee: e.target.value})}
            >
              <option value="">All Employees</option>
              {uniqueEmployees.map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
            <select
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={filters.month}
              onChange={(e) => setFilters({...filters, month: e.target.value})}
            >
              <option value="">All Months</option>
              {[...Array(12)].map((_, i) => (
                <option key={i+1} value={String(i+1)}>
                  {moment().month(i).format('MMMM')}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
            <select
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={filters.year}
              onChange={(e) => setFilters({...filters, year: e.target.value})}
            >
              <option value="">All Years</option>
              {uniqueYears.map(year => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr className="border-b-2 border-gray-300">
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Period
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Base Salary
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service Charge
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Deductions
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Net Salary
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Date
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                      <p className="text-lg">No payment records found</p>
                      <p className="mt-1 text-sm">Try adjusting your search or filter criteria</p>
                    </div>
                  </td>
                </tr>
              ) : (
                sortedGroups.map(([monthYear, items]) => {
                  const monthName = monthYear.split(' ')[0];
                  const monthColor = getMonthColor(monthName);
                  
                  return (
                    <React.Fragment key={`group-${monthYear}`}>
                      {/* Month header row with color coding */}
                      <tr className={`${monthColor} border-t-2 border-b border-gray-300`}>
                        <td colSpan="7" className="px-6 py-3 font-bold text-gray-800">
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full mr-3" style={{
                              backgroundColor: monthColors.find((_, i) => 
                                moment().month(i).format('MMMM') === monthName
                              )?.replace('bg-', '').replace('-50', '') || '#94a3b8'
                            }}></div>
                            {monthYear}
                            <span className="ml-2 text-sm font-normal text-gray-600">
                              ({items.length} payment{items.length > 1 ? 's' : ''})
                            </span>
                          </div>
                        </td>
                      </tr>
                      
                      {/* Payment records for the month */}
                      {items.map((item, index) => (
                        <tr 
                          key={`${item.employee_id}-${item.calculation_date}`}
                          className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100 ${
                            index === items.length - 1 ? 'border-b-2 border-gray-300' : 'border-b border-gray-200'
                          }`}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{item.employee_name}</div>
                                <div className="text-sm text-gray-500">{item.employee_id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {moment(item.calculation_date).format('MMM YYYY')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatCurrency(item.basic_salary)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatCurrency(item.total_service_charge)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-red-500">
                            {formatCurrency(item.total_deduction)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                            {formatCurrency(item.net_salary)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {moment(item.calculation_date).format('DD MMM YYYY')}
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {filteredHistory.length > 0 && (
          <div className="mt-4 text-sm text-gray-500">
            Showing {filteredHistory.length} of {history.length} records
            {filters.employee || filters.month || filters.year || searchTerm ? (
              <button 
                className="ml-4 text-blue-600 hover:text-blue-800"
                onClick={() => {
                  setFilters({ employee: '', month: '', year: '' });
                  setSearchTerm('');
                }}
              >
                Clear filters
              </button>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentHistory;