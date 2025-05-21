import api from './Api';

export const getProfile = async (id) => {
  const response = await api.get(`/setting/profile/${id}`);
  return response.data;
};

export const updateProfile = async (id) => {
  const response = await api.put(`/setting/profile/${id}`);
  return response.data;
};

export const changePassword = async (id, data) => {
  const response = await api.put(`/setting/password/${id}`, data);
  return response.data;
};

export const getAdmins = async () => {
  const response = await api.get(`/setting/admins`);
  return response.data;
};

export const getEmployees = async () => {
  const response = await api.get(`/setting/employees`);
  return response.data;
};

export const assignRole = async (employeeId) => {
  const response = await api.post(`/setting/admins`, { employeeId });
  return response.data;
};

export const deactivateAdmin = async (id) => {
  const response = await api.delete(`/setting/admins/${id}`);
  return response.data;
};
