import api from './Api';

export const loginUser = async (credentials) => {
  console.log(credentials);
  const response = await api.post('/auth/login', credentials);
  console.log(response.data);
  return response.data; // Returns user emailOrPhone, id, role, token, refresh token
};

export const registerUser = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data; // Returns success message
};
