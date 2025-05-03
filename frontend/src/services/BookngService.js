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

export default BookingService;
