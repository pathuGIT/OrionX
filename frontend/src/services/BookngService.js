import api from './Api';

const BookingService = {
  async createBooking(data) {
    try {
      const response = await api.post(`/booking/bookings`, data);
      return response.data;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  },
  async getBooking(id) {
    try {
      const response = await api.get(`/booking/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching booking:', error);
      throw error;
    }
  }
};

export const getBookings = async (status = 'all') => {
  try {
    const res = await api.get(`/booking?status=${status}`);
    return res.data;
  } catch (error) {
    console.error('Error fetching bookings:', error);
    throw error;
  }
}

export const searchBookingBy = async (status) => {
  try {
    const res = await api.get(`/booking/searchBooking?search=${status}`);
    return res.data;
  } catch (error) {
    console.error('Error searching booking by status:', error);
    throw error;
  }
}


export const getBookingDetails = async (id) => {
  try {
    const res = await api.get(`/booking/${id}`);
    return res.data;
  } catch (error) {
    console.error('Error fetching booking details:', error);
    throw error;
  }
}

export const getPrintBookingDetails = async (id) => {
  try {
    const res = await api.get(`/booking/printBookingDetails/${id}`);
    return res.data;
  } catch (error) {
    console.error('Error fetching print booking details:', error);
    throw error;
  }
}

export const updateBookingStatus = async (id, status, payDeposit) => {
  try {
    const res = await api.put(`/booking/${id}/status`, { status, payDeposit });
    return res.data;
  } catch (error) {
    console.error('Error updating booking status:', error);
    throw error;
  }
}

export const updateDamageFee = async (id, { damageFee, refundAmount, depositAmount, status }) => {
  try {
    const res = await api.put(`/booking/${id}/damage-fee`, { damageFee, refundAmount, depositAmount, status });
    return res.data;
  } catch (error) {
    console.error('Error updating damage fee:', error);
    throw error;
  }
}

// cal from customer side
export const updateMenuFee = async (id, { menueFee }) => {
  try {
    const res = await api.put(`/booking/${id}/menu-fee`, { menueFee });
    return res.data;
  } catch (error) {
    console.error('Error updating menu fee:', error);
    throw error;
  }
}

export const updateContract = async (id, contractData) => {
  try {
    const res = await api.put(`/booking/${id}/contract`, contractData);
    return res.data;
  } catch (error) {
    console.error('Error updating contract:', error);
    throw error;
  }
}

export const updateBookingPrice_BiteSoftLiquor = async (id) => {
  try {
    const res = await api.put(`/booking/BiteSoftLiquor/${id}`);
    return res.data;
  } catch (error) {
    console.error('Error updating booking price for BiteSoftLiquor:', error);
    throw error;
  }
}

export const updateBookingVenue = async (id, venueId) => {
  try {
    const res = await api.put(`/booking/${id}/venue`, { venueId });
    return res.data;
  } catch (error) {
    console.error('Error updating booking venue:', error);
    throw error;
  }
}

export const updateBookingGuest = async (id, { number_of_guests }) => {
  try {
    const res = await api.put(`/booking/${id}/guests`, { number_of_guests });
    return res.data;
  } catch (error) {
    console.error('Error updating booking guests:', error);
    throw error;
  }
}

export const updateAdditionalHours = async (id, { additionalHours }) => {
  try {
    const res = await api.put(`/booking/${id}/additional-hours`, { additionalHours });
    return res.data;
  } catch (error) {
    console.error('Error updating additional hours:', error);
    throw error;
  }
}

export const updateDate = async (id, { date }) => {
  try {
    const res = await api.put(`/booking/${id}/date`, { date });
    return res.data;
  } catch (error) {
    console.error('Error updating booking date:', error);
    throw error;
  }
}

// Add to services/BookngService.js
export const searchBookings = async (params) => {
  try {
    const response = await api.get('/bookings/search', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};
export default BookingService;