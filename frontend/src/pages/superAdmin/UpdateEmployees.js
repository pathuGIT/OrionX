import React, { useState, useEffect } from "react";
import {
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployees,
  getEmployeesByStatus,
  updateEmployeesStatus,
} from "../../services/UserService";

function UpdateEmployees() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  console.log("Selected Employee aa:", selectedEmployee);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    bod: "",
    salary: "",
    hire_date: "",
    service_charge_precentage: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [showActionPopup, setShowActionPopup] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("active");
  const [filterStatus, setFilterStatus] = useState();
  const [previousFilterStatus, setPreviousFilterStatus] = useState(null); // Track the previous filter status

  useEffect(() => {
    fetchEmployees();
  }, [filterStatus]);

  const fetchEmployees = async () => {
    try {
      if (filterStatus == null) {
        const response = await getEmployees();
        setEmployees(response.employees);
        return;
      }
      const response = await getEmployeesByStatus(filterStatus);
      console.log("Fetched employees (object):", response.employees);
      setEmployees(response.employees); // Ensure it's wrapped in an array if needed
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEdit = async (employeeId) => {
    try {
      const response = await getEmployeeById(employeeId);
      console.log("Fetched employee:", response);
      setSelectedEmployee(response);
      setFormData({
        name: response.name,
        phone: response.phone,
        email: response.email,
        bod:
          response.bod && !isNaN(new Date(response.bod).getTime())
            ? new Date(response.bod).toISOString().split("T")[0]
            : "",
        salary: response.salary,
        service_charge_precentage: response.service_charge_precentage,
        hire_date:
          response.hire_date && !isNaN(new Date(response.hire_date).getTime())
            ? new Date(response.hire_date).toISOString().split("T")[0]
            : "",
      });
      setShowPopup(true);
    } catch (error) {
      console.error("Error fetching employee:", error);
    }
  };

  const handleUpdate = async () => {
    try {
      await updateEmployee(selectedEmployee.employee_id, formData);
      alert("Employee updated successfully");
      setShowPopup(false);
      fetchEmployees(filterStatus);
    } catch (error) {
      console.error("Error updating employee:", error);
      setErrorMessage("An unexpected error occurred.");
    }
  };
  
  const handleUpdateEmployeesStatus = async () => {
    try {
      
      if (!selectedEmployee || !selectedStatus) {
       
       
        alert("Please select an employee and a status.");
        return;
      }
      console.log("aa",selectedStatus);
      await updateEmployeesStatus(selectedEmployee.employee_id, selectedStatus);
      alert("Employee status updated successfully");

      setShowActionPopup(false);
      fetchEmployees(filterStatus); // Refresh the employee list
    } catch (error) {
      console.error("Error updating employee status:", error);
      alert("An unexpected error occurred.");
    }
  };

  const handleActionClick = (employee) => {
    setSelectedEmployee(employee);
    setShowActionPopup(true);
  };
  const handleFilterChange = (status) => {
    setPreviousFilterStatus(filterStatus); // Save the current filter status before changing it
    setFilterStatus(status);
  };

  const handleBack = () => {
    setFilterStatus(previousFilterStatus); // Restore the previous filter status
    setPreviousFilterStatus(null);
    
  };

  return (
    <div className="max-w-6xl mx-auto p-4 bg-white shadow-md rounded-lg border border-red-500 mt-5">
      <p className="text-xl font-semibold mb-4">Update Employees</p>

      {/* Filter Buttons */}
      <div className="mb-4 flex space-x-4">
        <button
          onClick={() => setFilterStatus("active")}
          className={`px-4 py-2 rounded ${
            filterStatus === "active"
              ? "bg-green-500 text-white"
              : "bg-gray-300 text-black"
          }`}
        >
          Active
        </button>

        <button
          onClick={() => setFilterStatus("inactive")}
          className={`px-4 py-2 rounded ${
            filterStatus === "inactive"
              ? "bg-green-500 text-white"
              : "bg-gray-300 text-black"
          }`}
        >
          Inactive
        </button>
        {  (
          <button
            onClick={handleBack}
            className="px-4 py-2 rounded bg-blue-500 text-white"
          >
            Back
          </button>
        )}
      </div>

      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="border border-gray-300">
            <th className="py-1 px-2 border-r border-gray-300 text-left">
              Employee ID
            </th>
            <th className="py-1 px-2 border-r border-gray-300 text-left">
              Name
            </th>
            <th className="py-1 px-2 border-r border-gray-300 text-left">
              Phone
            </th>
            <th className="py-1 px-2 border-r border-gray-300  text-left">
              Email
            </th>
            <th className="py-1 px-2 border-r border-gray-300 text-left">
              Date of Birth
            </th>
            <th className="py-1 px-2 border-r border-gray-300 text-left">
              Salary
            </th>
            <th className="py-1 px-2 border-r border-gray-300 text-left">
              Service Charge (%)
            </th>
            <th className="py-1 px-2 border-r border-gray-300 text-left">
              Hire Date
            </th>
            <th className="py-1 px-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {employees
            ? employees.map((employee) => (
                <tr
                  key={employee.employee_id}
                  className="border border-gray-300"
                >
                  <td className="py-1 px-3 border-r border-gray-300">
                    {employee.employee_id}
                  </td>
                  <td className="py-0 px-3 border-r border-gray-300">
                    {employee.name}
                  </td>
                  <td className="py-1 px-2 border-r border-gray-300">
                    {employee.phone}
                  </td>
                  <td className="py-1 px-2 border-r border-gray-300">
                    {employee.email}
                  </td>
                  <td className="py-1 px-2 border-r border-gray-300">
                    {employee.bod && !isNaN(new Date(employee.bod).getTime())
                      ? new Date(employee.bod).toISOString().split("T")[0]
                      : "N/A"}
                  </td>
                  <td className="py-1 px-2 border-r border-gray-300">
                    {employee.salary}
                  </td>
                  <td className="py-1 px-2 border-r border-gray-300">
                    {employee.service_charge_precentage}
                  </td>
                  <td className="py-1 px-2 border-r border-gray-300">
                    {employee.hire_date &&
                    !isNaN(new Date(employee.hire_date).getTime())
                      ? new Date(employee.hire_date).toISOString().split("T")[0]
                      : "N/A"}
                  </td>
                  <td className="py-1 px-2">
                    <button
                      onClick={() => handleActionClick(employee)}
                      className="bg-blue-500 text-white px-2 py-1 rounded"
                    >
                      Actions
                    </button>
                  </td>
                </tr>
              ))
            : employees && (
                <tr className="border border-gray-300">
                  <td className="py-1 px-3 border-r border-gray-300">
                    {employees.employee_id}
                  </td>
                  <td className="py-0 px-3 border-r border-gray-300">
                    {employees.name}
                  </td>
                  <td className="py-1 px-2 border-r border-gray-300">
                    {employees.phone}
                  </td>
                  <td className="py-1 px-2 border-r border-gray-300">
                    {employees.email}
                  </td>
                  <td className="py-1 px-2 border-r border-gray-300">
                    {employees.bod && !isNaN(new Date(employees.bod).getTime())
                      ? new Date(employees.bod).toISOString().split("T")[0]
                      : "N/A"}
                  </td>
                  <td className="py-1 px-2 border-r border-gray-300">
                    {employees.salary}
                  </td>
                  <td className="py-1 px-2 border-r border-gray-300">
                    {employees.service_charge_precentage}
                  </td>
                  <td className="py-1 px-2 border-r border-gray-300">
                    {employees.hire_date &&
                    !isNaN(new Date(employees.hire_date).getTime())
                      ? new Date(employees.hire_date)
                          .toISOString()
                          .split("T")[0]
                      : "N/A"}
                  </td>
                  <td className="py-1 px-2">
                    <button
                      onClick={() => handleActionClick(employees)}
                      className="bg-blue-500 text-white px-2 py-1 rounded"
                    >
                      Actions
                    </button>
                  </td>
                </tr>
              )}
        </tbody>
      </table>

      {/* Action Popup */}
      {showActionPopup && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Employee Actions</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium">Change Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div className="space-y-4">
              <button
                onClick={() => handleEdit(selectedEmployee.employee_id)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Edit
              </button>
              <button
                onClick={handleUpdateEmployeesStatus}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Update Status
              </button>
              <button
                onClick={() => setShowActionPopup(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Edit Employee</h2>
            {errorMessage && (
              <div className="text-red-500 mb-4">{errorMessage}</div>
            )}
            <div className="space-y-4 w-96">
              {/* Form Fields */}
              <div>
                <label className="block text-sm font-medium">
                  Employee name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Phone number
                </label>
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Email address
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Date of birthday
                </label>
                <input
                  type="date"
                  name="bod"
                  placeholder="Date of Birth"
                  value={formData.bod}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-400 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Basic salary
                </label>
                <input
                  type="number"
                  name="salary"
                  placeholder="Salary"
                  value={formData.salary}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Service charge (%)
                </label>
                <input
                  type="number"
                  name="service_charge_precentage"
                  placeholder="Service Charge (%)"
                  value={formData.service_charge_precentage}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Hire date</label>
                <input
                  type="date"
                  name="hire_date"
                  placeholder="Hire Date"
                  value={formData.hire_date}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              {/* Other fields */}
              <div className="flex justify-between">
                <button
                  onClick={handleUpdate}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Update
                </button>
                <button
                  onClick={() => setShowPopup(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UpdateEmployees;
