import React, { useState, useEffect, useCallback } from 'react';
import moment from 'moment';
 
import {calculatePay, getPayEntries, deductionService } from "../../services/UserService";

const Pay = () => {
    const [selectedDate, setSelectedDate] = useState(moment());
    const [payData, setPayData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [notificationMsg, setNotificationMsg] = useState(null);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-LK', {
            style: 'currency',
            currency: 'LKR',
            minimumFractionDigits: 2
        }).format(value);
    };

    const showNotification = (message, isError = false) => {
        setNotificationMsg({ message, isError });
        setTimeout(() => setNotificationMsg(null), 5000);
    };

    const loadPayData = useCallback(async (date) => {
        try {
            setLoading(true);
            const formattedDate = date || selectedDate.format('YYYY-MM-DD');
            const response = await getPayEntries(formattedDate);
            
            setPayData(response.map(item => ({
                ...item,
                key: item.employee_id
            })));
        } catch (error) {
            showNotification(error.message || 'Failed to load pay data', true);
        } finally {
            setLoading(false);
        }
    }, [selectedDate]);

    const handleCalculate = async () => {
        try {
            setLoading(true);
            const formattedDate = selectedDate.format('YYYY-MM-DD');
            
            await deductionService.calculateAndSaveMonthlyDeduction(
                null,
                formattedDate
            );
            
            await calculatePay(formattedDate);
            
            showNotification('Salary calculation completed successfully');
            loadPayData(formattedDate);
        } catch (error) {
            showNotification(error.message || 'Failed to process payroll', true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPayData();
    }, [loadPayData]);

    return (
        <div className="pay-container" style={containerStyle}>
            {notificationMsg && (
                <div style={notificationStyle(notificationMsg.isError)}>
                    {notificationMsg.message}
                </div>
            )}

            <div className="control-panel" style={controlPanelStyle}>
                <input
                    type="month"
                    value={selectedDate.format('YYYY-MM')}
                    onChange={(e) => setSelectedDate(moment(e.target.value))}
                    style={dateInputStyle}
                />
                
                <button
                    onClick={handleCalculate}
                    disabled={loading}
                    style={buttonStyle(loading)}
                >
                    {loading ? 'Processing...' : 'Calculate Payroll'}
                </button>
            </div>

            <div style={tableWrapperStyle}>
                <table style={tableStyle}>
                    <thead>
                        <tr>
                            <th style={headerCellStyle}>Employee ID</th>
                            <th style={headerCellStyle}>Name</th>
                            <th style={headerCellStyle}>Basic Salary</th>
                            <th style={headerCellStyle}>Service Charge %</th>
                            <th style={headerCellStyle}>Service Charges</th>
                            <th style={headerCellStyle}>Deductions</th>
                            <th style={headerCellStyle}>Net Salary</th>
                            <th style={headerCellStyle}>Calculation Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payData.map((item) => (
                            <tr key={item.employee_id} style={rowStyle}>
                                <td style={cellStyle}>{item.employee_id}</td>
                                <td style={cellStyle}>{item.name}</td>
                                <td style={cellStyle}>{formatCurrency(item.basic_salary)}</td>
                                <td style={cellStyle}>{item.service_charge_percentage}%</td>
                                <td style={cellStyle}>{formatCurrency(item.total_service_charge)}</td>
                                <td style={cellStyle}>{formatCurrency(item.total_deduction)}</td>
                                <td style={cellStyle}>{formatCurrency(item.net_salary)}</td>
                                <td style={cellStyle}>
                                    {moment(item.calculation_date).format('DD MMM YYYY')}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan="8" style={footerCellStyle}>
                                Total Net Payroll: {formatCurrency(
                                    payData.reduce((sum, item) => sum + item.net_salary, 0)
                                )}
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
};

// Styling constants
const containerStyle = {
    padding: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
    fontFamily: 'Arial, sans-serif'
};

const controlPanelStyle = {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem',
    alignItems: 'center'
};

const dateInputStyle = {
    padding: '0.5rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem'
};

const buttonStyle = (loading) => ({
    padding: '0.5rem 1rem',
    background: loading ? '#ccc' : '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: loading ? 'not-allowed' : 'pointer',
    fontSize: '1rem',
    transition: 'background-color 0.3s'
});

const tableWrapperStyle = {
    overflowX: 'auto',
    boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
};

const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: 'white'
};

const headerCellStyle = {
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    borderBottom: '2px solid #dee2e6',
    textAlign: 'left',
    fontWeight: '600'
};

const rowStyle = {
    borderBottom: '1px solid #dee2e6',
    ':hover': {
        backgroundColor: '#f8f9fa'
    }
};

const cellStyle = {
    padding: '1rem',
    textAlign: 'left',
    whiteSpace: 'nowrap'
};

const footerCellStyle = {
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    fontWeight: '500',
    textAlign: 'right'
};

const notificationStyle = (isError) => ({
    position: 'fixed',
    top: '20px',
    right: '20px',
    padding: '1rem',
    backgroundColor: isError ? '#dc3545' : '#28a745',
    color: 'white',
    borderRadius: '4px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    zIndex: 1000
});

export default Pay;