import api from './Api';

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
export const getAllServiceChargeData = async () => {
    const response = await api.get("/user/getAllServiceChargeData");
    console.log("adoooo");
    console.log(response.data);
    return response.data;
};