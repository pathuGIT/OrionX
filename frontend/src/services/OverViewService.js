import api from './Api';  // your preconfigured axios instance

const BASE = '/overview';

export const OverViewService = {
  getKpis: () => api.get(`${BASE}/kpis`).then(res => res.data),
  getRevenueTrend: () => api.get(`${BASE}/revenue-trend`).then(res => res.data)
};

export const getRecentBookings = async () => {
  const response = await api.get(`${BASE}/recent-bookings`);
  console.log("Recent bookings fetched:", response);
  return response.data;
};