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

export const searchBookingBy = async (status = 'all') => {
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
  console.log("updateDamageFee called with:", id, damageFee, refundAmount, depositAmount, status);
  const res = await api.put(`/booking/${id}/damage-fee`, { damageFee, refundAmount, depositAmount, status });
  return res.data;
}

// cal from customer side
export const updateMenuFee = async (id, { menueFee }) => {
  const res = await api.put(`/booking/${id}/menu-fee`, { menueFee });
  return res.data;
}

export const updateContract = async (id, contractData) => {
  const res = await api.put(`/booking/${id}/contract`, contractData);
  return res.data;
}

export const updateBookingPrice_BiteSoftLiquor = async (id) => {
  const res = await api.put(`/booking/BiteSoftLiquor/${id}`);
  return res.data;
}

export const updateBookingVenue = async (id, venueId) => {
  const res = await api.put(`/booking/${id}/venue`, { venueId });
  return res.data;
}

export const updateBookingGuest = async (id, {number_of_guests}) => {
  const res = await api.put(`/booking/${id}/guests`,{number_of_guests});
  return res.data;
}

export const updateAdditionalHours = async (id, {additionalHours}) => {
  console.log("ssssssssssssssssss:",id,additionalHours)
  const res = await api.put(`/booking/${id}/additional-hours`, { additionalHours });
  return res.data;
}

export default BookingService;