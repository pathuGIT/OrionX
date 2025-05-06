import api from './Api';

const BookingService = {
  async createBooking(data) {
    const response = await api.post(`/booking/bookings`, data);
    return response.data;
  },
  async getBooking(id) {
    const response = await api.get(`/booking/${id}`);
    return response.data;
  }
};


/////////////
export const getBookings = async (status = 'all') => {
  const res = await api.get(`/booking?status=${status}`);
  return res.data;
}

export const getBookingDetails = async (id) => {
  const res = await api.get(`/booking/${id}`);
  console.log("xxxxxxxxxxx", res.data);
  return res.data;
}

export const updateBookingStatus = async (id, status) => {
  const res = await api.put(`/booking/${id}/status`, { status });
  return res.data;
}

export const updateDamageFee = async (id, { damageFee, refundAmount, depositAmount, status }) => {
  const res = await api.put(`/booking/${id}/damage-fee`, { damageFee, refundAmount, depositAmount, status });
  return res.data;
}

export const updateContract = async (id, contractData) => {
  const res = await api.put(`/booking/${id}/contract`, contractData);
  return res.data;
}

export const updatePricing = async (id, pricingData) => {
  const res = await api.put(`/booking/${id}/pricing`, pricingData);
  return res.data;
}

export const updateBookingVenue = async (id, venueId) => {
  const res = await api.put(`/booking/${id}/venue`, { venueId });
  return res.data;
}


export default BookingService;