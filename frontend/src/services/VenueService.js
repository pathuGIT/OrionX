import api from './Api';

export const addVenue = async (newVenue) => {
    console.log("aaa", newVenue)
    const response = await api.post(`/booking/addVenue`, newVenue);
    return response.data; 
}; 

export const getAllVenues = async () => {
    const response = await api.get(`/booking/getAllVenues`);
    return response.data;
};

// export const getVenueById = async (id) => {
//     const response = await api.get(`/booking/getVenueById/${id}`);
//     return response.data;
// };

// export const updateVenueById = async (id, updatedVenue) => {
//     const response = await api.put(`/booking/updateVenueById/${id}`, updatedVenue);
//     return response.data;
// };

// export const deleteVenueById = async (id) => {
//     const response = await api.delete(`/booking/deleteVenueById/${id}`);
//     return response.data;
// };

export const getVenueById = async (id) => {
   const response = await api.get(`/booking/getVenueById?id=${id}`);
    return response.data;
};

export const updateVenueById = async (id, updatedVenue) => {
    const response = await api.put(`/booking/updateVenueById?id=${id}`, updatedVenue);
    return response.data;
};

export const deleteVenueById = async (id) => {
    console.log("ssss",id)
    const response = await api.delete(`/booking/deleteVenueById?id=${id}`);
    return response.data;
};
