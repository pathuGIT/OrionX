import api from './Api';
import api_local from './ApiLocal';

export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    return response.data; // Returns user emailOrPhone, id, role, token, refresh token
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export const registerEmployee = async (employeeData) => {
  try {
    const response = await api.post('/auth/register-employee', employeeData);
    return response.data; // Returns success message
  } catch (error) {
    console.error('Error registering employee:', error);
    throw error;
  }
};

export const registerCustomer = async (customerData) => {
  console.log('Registering customer with data:', customerData);
  try {
    const response = await api.put('/auth/register-customer', customerData);
    return response.data; // Returns success message
  } catch (error) {
    console.error('Error registering customer:', error);
    throw error;
  }
};

export const updateCustomerPassword = async (customerData) => {
  console.log('Updating customer password with data:', customerData);
  try {
    const response = await api.put('/auth/update-customer-password', customerData);
    return response.data; // Returns success message
  } catch (error) {
    console.error('Error updating customer password:', error);
    throw error;
  }
}

export const validateEmail = async (email) => {
  try {
    const response = await api.get(`/auth/check-email?email=${email}`);
    return response.data; // Returns success message
  } catch (error) {
    return error.response?.data || { message: "An error occurred" };
  }
};

export const sendOtp = async (email) => {
  try {
    const response = await api.post('/auth/forgot-password', email);
    return response.data; // Returns success message  
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw error;
  }
};

export const validateOtp = async (data) => {
  try {
    const response = await api.post('/auth/validate-otp', data);
    return response.data; // Returns success message
  } catch (error) {
    console.error('Error validating OTP:', error);
    throw error;
  }
};

export const updateUserPassword = async (data) => {
  try {
    const response = await api.put('/auth/update-password', data);
    return response.data; // Returns success message
  } catch (error) {
    console.error('Error updating password:', error);
    throw error;
  }
}