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

export const getServiceVendors = async (customerId, bookingId) => {
    try {
        const response = await api.get(`/VendorServices/getServiceVendors/${customerId}/${bookingId}`);
        return response.data.data;
    } catch (error) {
        console.error("Error fetching vendors:", error);
        throw new Error(error.response?.data?.message || "Failed to load vendors");
    }
};



export const createOrUpdateArrangement = async (bookingId, data) => {
    try {
        const response = await api.post(`/tableArrangement/createTableArrangement/${bookingId}`, data);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to save arrangement');
    }
};

export const createReservation = async (bookingId, data) => {
    try {
        const response = await api.post(`/reservation/createReservation/${bookingId}`, data);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to create reservation');
    }
};

// export const getArrangementsByBooking = async (bookingId) => {
//     try {
//         const response = await api.get(`/tableArrangement/getTableArrangement/${bookingId}`);
//         return response.data;
//     } catch (error) {
//         if (error.response?.status === 404) return null;
//         throw new Error(error.response?.data?.error || 'Failed to fetch arrangement');
//     }
// };

export const getArrangementsByBooking = async (bookingId) => {
    try {
        const response = await api.get(`/tableArrangement/getTableArrangement/${bookingId}`);
        return response.data.map(arr => ({
            Arrangement_ID: arr.Arrangement_ID,
            Head_Table_Pax: arr.Head_Table_Pax,
            Top_Cloth_Color: arr.Top_Cloth_Color,
            Table_Cloth_Color: arr.Table_Cloth_Color,
            Bow_Color: arr.Bow_Color,
            Chair_Cover_Color: arr.Chair_Cover_Color,
            updated_at: arr.updated_at
        }));
    } catch (error) {
        if (error.response?.status === 404) return null;
        throw new Error(error.response?.data?.error || 'Failed to fetch arrangement');
    }
};

export const getReservationsByBooking = async (bookingId) => {
    try {
        const response = await api.get(`/reservations/${bookingId}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to fetch reservations');
    }
};

export const ColorPicker = ({ label, color, onChange }) => (
    <div className="form-group">
        <label>{label}</label>
        <div className="flex items-center gap-2">
            <input
                type="color"
                value={color}
                onChange={(e) => onChange(e.target.value)}
                className="w-12 h-12 rounded cursor-pointer"
            />
            <span className="font-mono">{color}</span>
        </div>
    </div>
)