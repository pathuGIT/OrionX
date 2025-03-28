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

export const deleteEmployees = async (employeeId) => {
    const response = await api.delete(`user/deleteEmployee/`, employeeId);
    return response.data;
};

export const updateEmployeesStatus = async (employee_Id, status) => {
    const data = { employee_Id, status };

    console.log(employee_Id, status);
    const response = await api.put("/user/updateStatus/",data);
    //fault
    console.log(response.data);
    return response.data;
};