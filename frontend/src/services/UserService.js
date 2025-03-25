import api from './Api';

export const getEmployees = async () => {
    const response = await api.get('/user/getEmployees');
    return response.data; 
}; 

//updateEmployee_link
export const updateEmployee = async (employeeId, data) => {
    const response = await api.put(`/user/updateEmployee/${employeeId}`, data);
    return response.data;
};

// Get employee by ID
export const getEmployeeById = async (employeeId) => {
    const response = await api.get(`/user/getEmployeeById/${employeeId}`);
    return response.data;
};

export const addEmployees = async (employeeData) => {
    const response = await api.post(`user/addEmployee/`, employeeData);
    return response.data;
};
