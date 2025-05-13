import React, { useState } from 'react';

const SalaryCalculator = () => {
    const [calculationDate, setCalculationDate] = useState('');
    const [employeesData, setEmployeesData] = useState([]);
    const [loadingStatus, setLoadingStatus] = useState(null);

    // Mock data - Replace with actual API calls in real application
    const mockEmployeeData = [
        { id: 1, name: 'John Doe', basic: 5000, services: 500, deductions: 200 },
        { id: 2, name: 'Jane Smith', basic: 6000, services: 600, deductions: 300 },
        { id: 3, name: 'Bob Johnson', basic: 5500, services: 550, deductions: 250 },
    ];

    const handleCalculate = () => {
        if (!calculationDate) {
            alert('Please select a calculation date');
            return;
        }

        setLoadingStatus('Calculating salaries...');
        
        // Simulate API call and calculation
        setTimeout(() => {
            const processedData = mockEmployeeData.map(emp => ({
                ...emp,
                net: emp.basic + emp.services - emp.deductions,
                calculationDate: calculationDate
            }));
            
            setEmployeesData(processedData);
            setLoadingStatus(null);
        }, 1500);
    };

    return (
        <div className="container">
            <h1>Employee Salary Calculation System</h1>
            
            <div className="control-panel">
                <label htmlFor="calculationDate">Calculation Date: </label>
                <input
                    type="date"
                    id="calculationDate"
                    value={calculationDate}
                    onChange={(e) => setCalculationDate(e.target.value)}
                />
                <button 
                    onClick={handleCalculate}
                    className="calculate-btn"
                >
                    Calculate Salaries
                </button>
            </div>

            {loadingStatus && <div className="status-message">{loadingStatus}</div>}

            {employeesData.length > 0 && (
                <div className="results-section">
                    <h3>Salary Calculation for: {calculationDate}</h3>
                    <table className="salary-table">
                        <thead>
                            <tr>
                                <th>Employee ID</th>
                                <th>Employee Name</th>
                                <th>Basic Salary</th>
                                <th>Services Charge</th>
                                <th>Deductions</th>
                                <th>Net Salary</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employeesData.map((employee) => (
                                <tr key={employee.id}>
                                    <td>{employee.id}</td>
                                    <td>{employee.name}</td>
                                    <td>${employee.basic.toFixed(2)}</td>
                                    <td>${employee.services.toFixed(2)}</td>
                                    <td>${employee.deductions.toFixed(2)}</td>
                                    <td>${employee.net.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <style jsx>{`
                .container {
                    padding: 2rem;
                    max-width: 1200px;
                    margin: 0 auto;
                    font-family: Arial, sans-serif;
                }

                h1 {
                    color: #2c3e50;
                    text-align: center;
                    margin-bottom: 2rem;
                }

                .control-panel {
                    display: flex;
                    gap: 1rem;
                    align-items: center;
                    margin-bottom: 2rem;
                    flex-wrap: wrap;
                }

                input[type="date"] {
                    padding: 0.5rem;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    font-size: 1rem;
                }

                .calculate-btn {
                    padding: 0.5rem 1.5rem;
                    background-color: #3498db;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: background-color 0.3s;
                }

                .calculate-btn:hover {
                    background-color: #2980b9;
                }

                .status-message {
                    padding: 1rem;
                    background-color: #f8f9fa;
                    border: 1px solid #dee2e6;
                    border-radius: 4px;
                    margin-bottom: 1rem;
                }

                .salary-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 1rem;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.12);
                }

                .salary-table th,
                .salary-table td {
                    padding: 1rem;
                    text-align: left;
                    border-bottom: 1px solid #dee2e6;
                }

                .salary-table th {
                    background-color: #f8f9fa;
                    font-weight: 600;
                }

                .salary-table tr:hover {
                    background-color: #f8f9fa;
                }

                .results-section h3 {
                    color: #495057;
                    margin-bottom: 1.5rem;
                }

                @media (max-width: 768px) {
                    .control-panel {
                        flex-direction: column;
                        align-items: stretch;
                    }
                    
                    input[type="date"] {
                        width: 100%;
                    }
                    
                    .calculate-btn {
                        width: 100%;
                        padding: 1rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default SalaryCalculator;