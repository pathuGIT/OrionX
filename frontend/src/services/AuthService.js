import api from './Api';

export const loginUser = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data; // Returns user emailOrPhone, id, role, token, refresh token
};

export const registerEmployee = async (employeeData) => {
  const response = await api.post('/auth/register-employee', employeeData);
  return response.data; // Returns success message
};

export const registerCustomer = async (customerData) => {
  const response = await api.post('/auth/register-customer', customerData);
  return response.data; // Returns success message
};

export const validateEmail = async (email) => {
  try {
    const response = await api.get(`/auth/check-email?email=${email}`);
    console.log(response.data)
    return response.data; // Returns success message
  } catch (error) {
    return error.response?.data || { message: "An error occurred" };
  }
};

export const sendOtp = async (email) => {
  console.log(email)
  const response = await api.post('/auth/forgot-password', email);
  return response.data; // Returns success message
};

export const validateOtp = async (data) => {
  console.log(data.otp)
  const response = await api.post('/auth/validate-otp', data);
  return response.data; // Returns success message
};

export const updateUserPassword = async (data) => {
  const response = await api.put('/auth/update-password', data);
  return response.data; // Returns success message
}