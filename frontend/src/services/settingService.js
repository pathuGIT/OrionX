import api from './Api';

export default {
  getProfile: () => api.get('/setting/profile').then(res => res.data),
  updateProfile: data => api.put('/setting/profile', data).then(res => res.data),
  changePassword: data => api.put('/setting/password', data).then(res => res.data),
  getAdmins: () => api.get('/setting/admins').then(res => res.data),
  getEmployees: () => api.get('/setting/employees').then(res => res.data),
  assignRole: employeeId => api.post('/setting/admins', { employeeId }).then(res => res.data),
  deactivateAdmin: userId => api.delete(`/setting/admins/${userId}`).then(res => res.data),
};