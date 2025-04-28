import express from 'express';
import { superAdmin } from '../middleware/Super_admin.js';
import { addVenue } from '../controllers/bookingController.js';


const router = express.Router();

router.post('/addVenue', superAdmin,  addVenue);

export default router;