import express from 'express';
import { createEvents } from '../controllers/eventController.js';
//import { validateEvent } from '../middleware/validateEvent.js';
import { createWedding } from '../controllers/weddingController.js';
import { getCustomerBookings } from '../controllers/customerBookingController.js';
import { customer } from '../middleware/Customer.js';
import { getPlannedEvents } from '../controllers/plannedEventController.js';
import { getServiceVendors } from '../controllers/serviceVendorController.js';
import { getEventServices } from '../controllers/eventServiceController.js';
import { saveSelectedServices } from '../controllers/saveSelectedServiceController.js';

// Create separate routers for events and weddings
const eventRoute = express.Router();
const weddingRoutes = express.Router();
const cusBookingRoutes = express.Router();
const dispayEventsRoutes = express.Router();
const serviceVendorRoutes = express.Router();
const EventServiceRoutes = express.Router();
const saveSelectedServiceRoutes = express.Router();


//app.js routes -ashen(don't delete this line)
eventRoute.post('/createCustomEvents',customer, createEvents);
weddingRoutes.post('/createWedding',customer, createWedding);
cusBookingRoutes.get('/:customerID',customer,getCustomerBookings);//controller -ashen(don't delete this line)
dispayEventsRoutes.get('/:customerID',customer,getPlannedEvents);
serviceVendorRoutes.get('/getServiceVendors',customer, getServiceVendors);
EventServiceRoutes.get('/getEventService',customer, getEventServices);
saveSelectedServiceRoutes.post('/saveServices',customer, saveSelectedServices);
export { eventRoute, weddingRoutes, cusBookingRoutes, dispayEventsRoutes, serviceVendorRoutes, EventServiceRoutes, saveSelectedServiceRoutes};