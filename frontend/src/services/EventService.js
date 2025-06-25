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


export const getArrangementsByBooking = async (bookingId) => {
    try {
        const response = await api.get(`/tableArrangement/getTableArrangement/${bookingId}`);
        return response.data; // Directly return the array of arrangements
    } catch (error) {
        if (error.response?.status === 404) return []; // Return empty array for 404
        throw new Error(error.response?.data?.error || 'Failed to fetch arrangements');
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

export const createPlanBar = async (bookingId, planBarData) => {
    try {
        const response = await api.post(`/Bar/planBar/${bookingId}`, planBarData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to save bar plan');
    }
};

export const updatePlanBar = async (bookingId, data) => {
    try {
        const response = await api.put(`/Bar/updatePlanBar/${bookingId}`, data);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to update bar plan');
    }
};

export const deletePlanBar = async (bookingId) => {
    try {
        const response = await api.delete(`/Bar/deletePlanBar/${bookingId}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to delete bar plan');
    }
};

export const getPlanBar = async (bookingId) => {
    try {
        const response = await api.get(`/Bar/getPlanBar/${bookingId}`);
        return response.data?.data || null;
    } catch (error) {
        if (error.response?.status === 404) return null;
        throw new Error(error.response?.data?.error || 'Failed to fetch bar plan');
    }
};

// Bite Menu Services
export const getBiteMenuItems = async () => {
    try {
        const response = await api.get('/Bite/bite-menu-items');
        return response.data.data || []; // Directly return data array
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to fetch menu items');
    }
};

export const PlanBiteMenu = async (bookingId, data) => {
    try {
        const response = await api.post(`/Bite/planBite/${bookingId}`, { biteItems: data });
        return response.data.data; // Return direct data
    } catch (error) {
        const message = error.response?.data?.error || 'Failed to save bite menu';
        throw new Error(message);
    }
};

export const getBiteMenu = async (bookingId) => {
    try {
        const response = await api.get(`/Bite/getPlanBite/${bookingId}`);
        return {
            biteItems: response.data?.data?.biteItems || [], // Now matches backend
            totalPrice: response.data?.data?.totalPrice || 0
        };
    } catch (error) {
        return { biteItems: [], totalPrice: 0 };
    }
};

export const UpdateBiteMenu = async (bookingId, data) => {
    try {
        const response = await api.put(`/Bite/updatePlanBite/${bookingId}`, { biteItems: data });
        return response.data.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to update bite menu');
    }
};

export const deleteBiteMenu = async (bookingId) => {
    try {
        await api.delete(`/Bite/deletePlanBite/${bookingId}`);
        return true;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to delete bite menu');
    }
};




export const BarService = {

    // Liquor Item Services
    addLiquorItem: async (bookingId, data) => {
        try {
            const response = await api.post(`/BarArrange/liquor/${bookingId}`, data);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error || 'Failed to add liquor item');
        }
    },

    updateLiquorItem: async (bookingId, itemId, data) => {
        try {
            const response = await api.put(`/BarArrange/liquor/${bookingId}/${itemId}`, data);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error || 'Failed to update liquor item');
        }
    },

    deleteLiquorByName: async (bookingId, itemId) => {
        try {
            const response = await api.delete(`/BarArrange/liquor/${bookingId}/${itemId}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error || 'Failed to delete liquor items');
        }
    },

    deleteSoftDrinkByName: async (bookingId, itemId) => {
        try {
            const response = await api.delete(`/BarArrange/soft-drinks/${bookingId}/${itemId}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error || 'Failed to delete soft drink items');
        }
    },

    // Soft Drink Item Services
    addSoftDrinkItem: async (bookingId, data) => {
        try {
            const response = await api.post(`/BarArrange/soft-drinks/${bookingId}`, data);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error || 'Failed to add soft drink item');
        }
    },

    updateSoftDrinkItem: async (bookingId, itemId, data) => {
        try {
            const response = await api.put(`/BarArrange/soft-drinks/${bookingId}/${itemId}`, data);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error || 'Failed to update soft drink item');
        }
    },

    // General Bar Services
    getBarDetails: async (bookingId) => {
        try {
            const response = await api.get(`/BarArrange/barDetails/${bookingId}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error || 'Failed to fetch bar details');
        }
    }
};

// Admin Services


export const getAssignmentOptions = async () => {
  try {
    const response = await api.get('/assignedEmployee/getAssignmentOptions');
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch assignment options');
  }
};

export const assignEmployeeToEvent = async (data) => {
  try {
    const response = await api.post('/assignedEmployee/assignToEvent', data);
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Assignment failed');
  }
};

export const getAssignments = async () => {
  try {
    const response = await api.get('/assignedEmployee/assignments');
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to get assignments');
  }
};

export const updateAssignment = async (assignmentId, data) => {
  try {
    const response = await api.put(`/assignedEmployee/assignments/${assignmentId}`, data);
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Update failed');
  }
};

export const deleteAssignment = async (assignmentId) => {
  try {
    await api.delete(`/assignedEmployee/assignments/${assignmentId}`);
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Delete failed');
  }
};


//wedding admin
 
//  export const getAllEvents = async () => {
//     try {
//       const response = await api.get('/AdminEvents/events');
//       return response.data;
//     } catch (error) {
//       throw new Error(error.response?.data?.error || 'Failed to fetch events');
//     }
//   };

//    export const createEvent = async (eventType, data) => {
//     try {
//       const response = await api.post('/AdminEvents/events', { eventType, data });
//       return response.data;
//     } catch (error) {
//       throw new Error(error.response?.data?.error || 'Event creation failed');
//     }
//   };

//    export const  updateEvent = async (eventId, eventType, data) => {
//     try {
//       const response = await api.put(`/AdminEvents/events/${eventId}`, { eventType, data });
//       return response.data;
//     } catch (error) {
//       throw new Error(error.response?.data?.error || 'Event update failed');
//     }
//   };

//    export const deleteEvent = async (eventId, eventType) => {
//     try {
//       await api.delete(`/AdminEvents/events/${eventId}`, { data: { eventType } });
//     } catch (error) {
//       throw new Error(error.response?.data?.error || 'Event deletion failed');
//     }
//   };

   export const getEventById = async (eventId) => {
    try {
      const response = await api.get(`/AdminEvents/events/${eventId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch event');
    }
  };

  export const getAllEvents = async () => {
  try {
    const response = await api.get('/AdminEvents/events');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch events');
  }
};

export const updateEvent = async (eventId, data) => {
  try {
    const response = await api.put(`/AdminEvents/events/${eventId}`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Event update failed');
  }
};

export const deleteEvent = async (eventId) => {
  try {
    await api.delete(`/AdminEvents/events/${eventId}`);
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Event deletion failed');
  }
};
