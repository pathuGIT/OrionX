import api from './Api';

export const addVenue = async (newVenue) => {
    try {
        const response = await api.post(`/booking/addVenue`, newVenue);
        return response.data;
    } catch (error) {
        console.error('Error adding venue:', error);
        throw error;
    }
};

export const getAllVenues = async () => {
    try {
        const response = await api.get(`/booking/getAllVenues`);
        return response.data;
    } catch (error) {
        console.error('Error fetching all venues:', error);
        throw error;
    }
};

export const getVenueById = async (id) => {
    try {
        const response = await api.get(`/booking/getVenueById?id=${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching venue by ID:', error);
        throw error;
    }
};

export const updateVenueById = async (id, updatedVenue) => {
    try {
        const response = await api.put(`/booking/updateVenueById?id=${id}`, updatedVenue);
        return response.data;
    } catch (error) {

        throw error;
    }
};

export const deleteVenueById = async (id) => {
    try {
        const response = await api.delete(`/booking/deleteVenueById/${id}`);
        return response.data;
    } catch (error) {

        throw error;
    }
};

export const checkVenueIDByBooking = async (id) => {
    try {
        const response = await api.get(`/booking/checkBookingByVenueId/${id}`);
        return response.data;
    } catch (error) {
        
        throw error;
    }
};