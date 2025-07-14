import express from 'express';
import { fetchMenuOverview } from '../controllers/advanceMenuViewCtrl.js';

const router = express.Router();
router.get('/overview', fetchMenuOverview);
export default router