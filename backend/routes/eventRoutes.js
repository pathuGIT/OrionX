import express from 'express';
import { createEvents } from '../controllers/eventController.js';
//import { validateEvent } from '../middleware/validateEvent.js';
import { createWedding } from '../controllers/weddingController.js';
import { customerBookingController } from '../controllers/customerBookingController.js';

// Create separate routers for events and weddings
const eventRoute = express.Router();
const weddingRoutes = express.Router();
const cusBookingRoutes = express.Router();



eventRoute.post('/', createEvents);
weddingRoutes.post('/', createWedding);
cusBookingRoutes.get('/:customerID', customerBookingController);

export { eventRoute, weddingRoutes, cusBookingRoutes };