import api from './Api';

// Create a wedding event
export const createWedding = async (formData) => {
    const response = await api.post('/wedding/createWedding', formData);
    return response.data;
};

// Create an event
export const createEvents = async (formData) => {
    const response = await api.post('/event/createCustomEvents', formData);
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


export const getPlannedEvents = async (customerID) => {
    try {
        const response = await api.get(`/displayEvents/${customerID}`);
        return response.data.data;
    } catch (error) {
        console.error("You Have No Planned Events:", error);
        throw error;
    }
};

export const getEventServices = async () => {
    try {
        const response = await api.get('/EventService/getEventService');
        console.log("API Response:", response.data); // Verify structure here
        return response.data.data.map(service => ({
            Event_Service_ID: service.id || service.serviceId,
            Event_Service_Name: service.name || service.serviceName,
            Event_Service_Image: service.imagePath || service.serviceImage
        }));
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
};

export const saveSelectedServices = async (customerId, bookingId, services) => {
    try {
        const response = await api.post('/CustomerService/saveServices', {
            customerId,
            bookingId,
            serviceIds: services
        });
        return response.data;
    } catch (error) {
        console.error("Save error:", error);
        throw new Error(error.response?.data?.message || "Failed to save services");
    }
};