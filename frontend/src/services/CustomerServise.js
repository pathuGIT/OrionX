import api from './Api';

export const addCustomer = async (cusData) => {
    const response = await api.post(`user/addCustomer/`, cusData);
    return response.data;
};