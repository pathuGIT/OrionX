import api from './Api';

export const getEmploees = async () => {
    const response = await api.get('/user/getEmployees');
    console.log(response.data);
    return response.data; 
};