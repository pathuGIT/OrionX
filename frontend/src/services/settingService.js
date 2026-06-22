import api from './Api';

export const getProfile = async (id) => {
  try {
    const response = await api.get(`/setting/profile/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};

export const updateProfile = async (id, data) => {
  try {
    const response = await api.put(`/setting/profile/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

export const changePassword = async (id, data) => {
  try {
    const response = await api.put(`/setting/password/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error changing password:', error);
    throw error;
  }
};

export const getAdmins = async () => {
  try {
    const response = await api.get(`/setting/admins`);
    return response.data;
  } catch (error) {

    throw error;
  }
};

export const getEmployees = async () => {
  try {
    const response = await api.get(`/setting/employees`);
    return response.data;
  } catch (error) {

    throw error;
  }
};

export const assignRole = async (employeeId, role, password, adminId) => {
  try {
    const response = await api.put(`/setting/admins`, {
      employeeId,
      role,
      password,
      adminId
    })
    return response.data
  } catch (error) {
    console.error('Error assigning role:', error);
    throw error;
  }
}

export const deactivateAdmin = async (id) => {
  try {
    const response = await api.delete(`/setting/admins/${id}`);
    return response.data;
  } catch (error) {
    
    throw error;
  }
};

