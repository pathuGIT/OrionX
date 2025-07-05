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
import {
    getBiteMenuItems,
    createBiteMenu,
    getBiteMenu,
    updateBiteMenu,
    deleteBiteMenu
} from '../controllers/planBiteController.js';
import { barController } from '../controllers/barController.js';
import { assignEmployeeToEvent, getAssignmentOptions, getAssignments, updateAssignment, deleteAssignment } from '../controllers/superAdmin/eventAssignEmployeeController.js';
import {
    createEvent,
    updateEvent,
    deleteEvent,
    getAllEvents,
    getEventById
} from '../controllers/superAdmin/allEventsController.js';

import { getAllEventServices, createEventService, updateEventService, deleteEventService, getEventServiceById, uploadServiceImage } from '../controllers/superAdmin/adminEventServiceController.js';





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
const planBiteRoutes = express.Router();
const BarArrangeRoutes = express.Router();



// Admin routes 
const AdminRoutes = express.Router();
const AdminEventRoutes = express.Router();



//app.js routes -ashen(don't delete this line)
eventRoute.post('/createCustomEvents', customer, createEvents);
weddingRoutes.post('/createWedding', customer, createWedding);
cusBookingRoutes.get('/:customerID', customer, getCustomerBookings);//controller -ashen(don't delete this line)
dispayEventsRoutes.get('/:customerID', customer, getPlannedEvents);
serviceVendorRoutes.get('/getServiceVendors/:customerId/:bookingId', customer, getVendorsForCustomerBooking);
EventServiceRoutes.get('/getEventService', customer, getEventServices);
saveSelectedServiceRoutes.post('/saveServices', customer, saveSelectedServices);
tableArrangementRoutes.post('/createTableArrangement/:bookingid', customer, createArrangement);
reservationRoutes.post('/createReservation/:bookingid', customer, createReservation);
tableArrangementRoutes.get('/getTableArrangement/:bookingid', customer, getArrangementsByBooking);
planBarRoutes.post('/planBar/:bookingid', customer, createPlanBarEvent);//did
planBarRoutes.get('/getPlanBar/:bookingid', customer, getPlanBarEvent);
planBarRoutes.delete('/deletePlanBar/:bookingid', customer, deletePlanBarEvent);
planBarRoutes.put('/updatePlanBar/:bookingid', customer, updatePlanBarEvent);
planBiteRoutes.get('/bite-menu-items', customer, getBiteMenuItems);
planBiteRoutes.post('/planBite/:bookingid', customer, createBiteMenu);
planBiteRoutes.get('/getPlanBite/:bookingid', getBiteMenu);
planBiteRoutes.put('/updatePlanBite/:bookingid', customer, updateBiteMenu);
planBiteRoutes.delete('/deletePlanBite/:bookingid', customer, deleteBiteMenu);
BarArrangeRoutes.post('/liquor/:booking_id', barController.addLiquorItem);
BarArrangeRoutes.post('/soft-drinks/:booking_id', barController.addSoftDrinkItem);
BarArrangeRoutes.get('/barDetails/:booking_id', barController.getBarDetails);
BarArrangeRoutes.put('/liquor/:booking_id/:item_id', barController.updateLiquorItem);
BarArrangeRoutes.delete('/liquor/:booking_id/:item_id', barController.deleteLiquorItem);
BarArrangeRoutes.put('/soft-drinks/:booking_id/:item_id', barController.updateSoftDrinkItem);
BarArrangeRoutes.delete('/soft-drinks/:booking_id/:item_id', barController.deleteSoftDrinkItem);

AdminRoutes.post('/assignToEvent', assignEmployeeToEvent);
AdminRoutes.get('/getAssignmentOptions', getAssignmentOptions);
AdminRoutes.get('/assignments', getAssignments);
AdminRoutes.put('/assignments/:id', updateAssignment);
AdminRoutes.delete('/assignments/:id', deleteAssignment);


AdminEventRoutes.post('/events', createEvent);
AdminEventRoutes.get('/events', getAllEvents);
AdminEventRoutes.get('/events/:id', getEventById);
AdminEventRoutes.put('/events/:id', updateEvent);
AdminEventRoutes.delete('/events/:id', deleteEvent);

AdminEventRoutes.get('/getAdminEventServices', getAllEventServices);
AdminEventRoutes.post('/createAdminEventService', createEventService);
AdminEventRoutes.put('/updateAdminEventService/:id', updateEventService);
AdminEventRoutes.delete('/deleteAdminEventService/:id', deleteEventService);
AdminEventRoutes.get('/getAdminEventServices/:id', getEventServiceById);
AdminEventRoutes.post('/uploadServiceImage', uploadServiceImage);




export { eventRoute, weddingRoutes, cusBookingRoutes, dispayEventsRoutes, serviceVendorRoutes, EventServiceRoutes, saveSelectedServiceRoutes, tableArrangementRoutes, reservationRoutes, planBarRoutes, planBiteRoutes, BarArrangeRoutes, AdminRoutes, AdminEventRoutes };