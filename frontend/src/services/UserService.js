import api from './Api';
import axios from 'axios';

export const getEmployees = async () => {
    const response = await api.get('/user/getEmployees');
    return response.data; 
}; 

//updateEmployee_link
export const updateEmployee = async (employeeId, data) => {
    const datat = { id:employeeId, name: data.name, phone:data.phone, email:data.email, bod:data.bod, salary:data.salary, service_charge_precentage:data.service_charge_precentage, hire_date:data.hire_date  };
    console.log(datat)
    const response = await api.put("/user/updateEmployee/", datat);
     
    return response.data;
};

// Get employee by ID
export const getEmployeeById = async (employeeId) => {
    const response = await api.get(`/user/getEmployeeById/${employeeId}`);
   //console.log(response.data);
    return response.data;
};

export const addEmployees = async (employeeData) => {
    const response = await api.post(`user/addEmployee/`, employeeData);
    return response.data;
};

export const deleteEmployees = async (employeeId) => {
    const response = await api.delete(`user/deleteEmployee/`, employeeId);
    return response.data;
};

export const updateEmployeesStatus = async (employee_Id, status) => {
    const data = { employee_Id, status };
    console.log(data);
    const response = await api.put("/user/updateStatus/",data);
    console.log(response.data);
    return response.data;
};

// export const getEmployeesByStatus = async (status) => {
//     const data = { status };
//     console.log(data);
//     const response = await api.get("/user/getEmployeesByStatus/", data);
//     //console.log(response);
//     return response.data;

// };
// Get employee by ID
export const getEmployeesByStatus = async (status) => {
    const response = await api.get(`/user/getEmployeesByStatus/${status}`);
    return response.data;
};

// Get all service charge data
// export const getAllServiceChargeData = async () => {
//     const response = await api.get("/user/getAllServiceChargeData");
//     // console.log("adoooo");
//     // console.log(response.data);
//     return response.data;
// };
// Service Charge Calculation Logic
// export const calculateServiceChargeDistribution = async () => {
//     const response = await api.get("/user/getAllServiceChargeData");
//     return response.data;
// };

export const serviceChargeService = {
    calculateCharges: async () => {
      try {
        const response = await api.post('/user/service-charges/calculate');
        return {
          success: true,
          message: response.data.message,
          affectedRows: response.data.affectedRows
        };
      } catch (error) {
        return {
          success: false,
          message: error.response?.data?.message || 'Calculation failed',
          error: error.message
        };
      }
    },
  
    getAllCharges: async () => {
      try {
        const response = await api.get('/user/service-charges');
        return {
          success: true,
          data: response.data.data || [],
          count: response.data.count || 0
        };
      } catch (error) {
        return {
          success: false,
          message: error.response?.data?.message || 'Failed to fetch charges',
          error: error.message
        };
      }
    }
  };

  //deduction......................

  export const deductionService = {
    calculateDeductions: () => axios.post('/user/deductions/calculate'),
    getAllDeductions: () => axios.get('/user/deductions'),
    getDeductionDetails: (id) => axios.get(`/user/deductions/${id}`),
    updateDeductionStatus: (id, status) => 
      axios.patch(`/user/deductions/${id}/status`, { status })
  };