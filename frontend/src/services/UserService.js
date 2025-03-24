import api from './Api';

export const getEmployees = async () => {
    const response = await api.get('/user/getEmployees');
    return response.data; 
}; 

//updateEmployee_link
export const updateEmployees = async (employeeId, data) => {
    const response = await api.put(`/employees/${employeeId}`, data);
    return response.data;
};
