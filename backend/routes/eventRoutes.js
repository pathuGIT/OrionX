import express from 'express';
import { createEvents } from '../controllers/eventController.js';
//import { validateEvent } from '../middleware/validateEvent.js';
import { createWedding } from '../controllers/weddingController.js';
import { getCustomerBookings } from '../controllers/customerBookingController.js';
import { customer } from '../middleware/Customer.js';
import { getPlannedEvents } from '../controllers/plannedEventController.js';
import { getVendorsForCustomerBooking } from '../controllers/serviceVendorController.js';
import { getEventServices } from '../controllers/eventServiceController.js';
import { saveSelectedServices } from '../controllers/saveSelectedServiceController.js';
import { createArrangement } from '../controllers/arrangementController.js';
import { createReservation } from '../controllers/arrangementController.js';
import { getArrangementsByBooking } from '../controllers/arrangementController.js';
import { createPlanBarEvent } from '../controllers/planBarController.js';
import { getPlanBarEvent } from '../controllers/planBarController.js';
import { deletePlanBarEvent } from '../controllers/planBarController.js';
import { updatePlanBarEvent } from '../controllers/planBarController.js';





// Create separate routers for events and weddings
const eventRoute = express.Router();
const weddingRoutes = express.Router();
const cusBookingRoutes = express.Router();
const dispayEventsRoutes = express.Router();
const serviceVendorRoutes = express.Router();
const EventServiceRoutes = express.Router();
const saveSelectedServiceRoutes = express.Router();
const tableArrangementRoutes = express.Router();
const reservationRoutes = express.Router();
const planBarRoutes = express.Router();



//app.js routes -ashen(don't delete this line)
eventRoute.post('/createCustomEvents',customer, createEvents);
weddingRoutes.post('/createWedding',customer, createWedding);
cusBookingRoutes.get('/:customerID',customer,getCustomerBookings);//controller -ashen(don't delete this line)
dispayEventsRoutes.get('/:customerID',customer,getPlannedEvents);
serviceVendorRoutes.get('/getServiceVendors/:customerId/:bookingId',customer, getVendorsForCustomerBooking);
EventServiceRoutes.get('/getEventService',customer, getEventServices);
saveSelectedServiceRoutes.post('/saveServices',customer, saveSelectedServices);
tableArrangementRoutes.post('/createTableArrangement/:bookingid', createArrangement);
reservationRoutes.post('/createReservation/:bookingid', createReservation);
tableArrangementRoutes.get('/getTableArrangement/:bookingid', getArrangementsByBooking);
planBarRoutes.post('/planBar/:bookingid', createPlanBarEvent );//did
planBarRoutes.get('/getPlanBar/:bookingid', getPlanBarEvent);
planBarRoutes.delete('/deletePlanBar/:bookingid', deletePlanBarEvent );
planBarRoutes.put('/updatePlanBar/:bookingid', updatePlanBarEvent );


export { eventRoute, weddingRoutes, cusBookingRoutes, dispayEventsRoutes, serviceVendorRoutes, EventServiceRoutes, saveSelectedServiceRoutes, tableArrangementRoutes, reservationRoutes,planBarRoutes};