import {
  fetchKpis,
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
