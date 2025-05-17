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

export const getCusName = async (id) => {
  try {
    //const response = await api.get(`/user/getCusName/${id}`);
    const response = await api.get(`/user/getCusName`, {
      params: { id: id }  // <- this sends ?q=value in the URL
    });
    return response.data; // Adjust based on your API response structure
  } catch (error) {
    console.error('Error fetching customer name:', error);
    return 'Unknown'; // Return a fallback value in case of an error
  }
};

