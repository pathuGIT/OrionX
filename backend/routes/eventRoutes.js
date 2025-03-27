import express from 'express';
import { createEvents } from '../controllers/eventController.js';
//import { validateEvent } from '../middleware/validateEvent.js';
import { createWedding } from '../controllers/weddingController.js';
import { getCustomerBookingController } from '../controllers/getCustomerBookingController.js';

// Create separate routers for events and weddings
export const eventRoute = express.Router();
eventRoute.post('/', createEvents);

export const weddingRoutes = express.Router();
weddingRoutes.post('/', createWedding);

export const cusBookingRoutes = express.Router();
cusBookingRoutes.get('/:customerID', getCustomerBookingController);