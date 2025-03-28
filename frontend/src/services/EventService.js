import api from './Api';

// Create a wedding event
export const createWedding = async (formData) => {
    const response = await api.post('/createWedding', formData);
    return response.data;
};

// Create an event
export const createEvents = async (formData) => {
    const response = await api.post('/createCustomEvents', formData);
    return response.data;
};

// Get customer bookings
export const getCustomerBookings = async (customerID) => {
    try {
        const response = await api.get(`/customer/${customerID}`);
        return response.data.data;
    } catch (error) {
        console.error("You Have No Bookings:", error);
        throw error;
    }
};
