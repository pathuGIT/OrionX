import {
  fetchKpis,
  fetchRecentBookings,
  fetchRevenueTrend
} from '../models/overViewModel.js';

export async function getKpis(req, res, next) {
  try {
    const kpis = await fetchKpis();
    res.json(kpis);
  } catch (err) {
    next(err);
  }
}

export async function getRevenueTrend(req, res, next) {
  try {
    const trend = await fetchRevenueTrend();
    res.json(trend);
  } catch (err) {
    next(err);
  }
}
export const getRecentBookings = async (req, res, next) => {
  try {
    const bookings = await fetchRecentBookings();
    res.json(bookings);
  } catch (err) {
    next(err);
  }
};
