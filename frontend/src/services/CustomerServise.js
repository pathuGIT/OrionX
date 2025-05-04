import api from './Api';

export const addCustomer = async (cusData) => {
    const response = await api.post(`user/addCustomer/`, cusData);
    return response.data;
};
export const searchCustomer = async (searchTerm) => {
  const response = await api.get(`/user/searchCustomer`, {
    params: { q: searchTerm }  // <- this sends ?q=value in the URL
  });
  return response.data;
};
