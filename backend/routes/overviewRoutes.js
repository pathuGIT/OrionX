import express from 'express';
import { superAdmin } from '../middleware/Super_admin.js';
import {
  getKpis,
  getRevenueTrend
} from '../controllers/overViewController.js';

const router = express.Router();

// protect with your superAdmin middleware
router.get('/kpis', superAdmin, getKpis);
router.get('/revenue-trend', superAdmin, getRevenueTrend);

export default router;
