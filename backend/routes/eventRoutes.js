import express from 'express';
import { createEvents } from '../controllers/eventController.js';
//import { validateEvent } from '../middleware/validateEvent.js';
import { createWedding } from '../controllers/weddingController.js';
import { getCustomerBookings } from '../controllers/customerBookingController.js';
import { customer } from '../middleware/Customer.js';

// Create separate routers for events and weddings
const eventRoute = express.Router();
const weddingRoutes = express.Router();
const cusBookingRoutes = express.Router();



eventRoute.post('/createEvent',customer, createEvents);
weddingRoutes.post('/createWedding',customer, createWedding);
cusBookingRoutes.get('/:customerID',customer,getCustomerBookings);

export { eventRoute, weddingRoutes, cusBookingRoutes };