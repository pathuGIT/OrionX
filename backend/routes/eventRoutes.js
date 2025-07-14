import express from 'express';
import { createEvents } from '../controllers/eventController.js';
//import { validateEvent } from '../middleware/validateEvent.js';
import { createWedding } from '../controllers/weddingController.js';
import { getCustomerBookings,getTotallBookingCustomerBookings } from '../controllers/customerBookingController.js';
import { customer } from '../middleware/Customer.js';
import { superAdmin } from '../middleware/Super_admin.js';
import { getPlannedEvents, updatetheEvent, deletetheEvent } from '../controllers/plannedEventController.js';
import { getVendorsForCustomerBooking } from '../controllers/serviceVendorController.js';
import { getEventServices } from '../controllers/eventServiceController.js';
import { saveSelectedServices } from '../controllers/saveSelectedServiceController.js';
import { createArrangement } from '../controllers/arrangementController.js';
import { createReservation } from '../controllers/arrangementController.js';
import { getArrangementsByBooking, getAllTableswithDesigns } from '../controllers/arrangementController.js';
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

import { getAllEventServices, createEventService, updateEventService, deleteEventService, getEventServiceById, uploadServiceImage, getAllEventServicesSimple } from '../controllers/superAdmin/adminEventServiceController.js';

import {getAllVendors , createVendor, updateVendor, deleteVendor, getVendorServices ,assignServicesToVendor, getVendorById  } from '../controllers/superAdmin/adminVendorController.js';

import { getAllCustomerEventServices, getCustomerEventServiceById, createCustomerEventService, updateCustomerEventService, deleteCustomerEventService, getAllCustomers, getAllBookings, getAllEventServicesCustomer } from '../controllers/superAdmin/customerEventServiceController.js';

import { createAdminArrangement, getAllArrangements, getArrangementById, updateArrangement, deleteArrangement,getAllEventsForTable } from '../controllers/superAdmin/adminTableChairArrangementController.js';

import { createTableDesign, getAllTableDesigns, getTableDesignById, updateTableDesign, deleteTableDesign } from '../controllers/superAdmin/tableDesignController.js';

import { adminBarManagementController } from '../controllers/superAdmin/adminBarManagementController.js';

import { getEventProgress } from '../controllers/customerDashboardController.js';

import { downloadEventReport,getAllBookingReports } from '../controllers/eventPDFReportController.js';

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

const progressRoutes = express.Router();
const pdfRoutes = express.Router();



// Admin routes 
const AdminRoutes = express.Router();
const AdminEventRoutes = express.Router();



//app.js routes -ashen(don't delete this line)
eventRoute.post('/createCustomEvents', customer, createEvents);
weddingRoutes.post('/createWedding', customer, createWedding);
cusBookingRoutes.get('/:customerID',customer, getCustomerBookings);//controller -ashen(don't delete this line)
dispayEventsRoutes.get('/:customerID/:bookingID', customer, getPlannedEvents);
dispayEventsRoutes.put('/updateEvent/:Id', customer, updatetheEvent);
dispayEventsRoutes.delete('/deleteEvent/:Id',customer,  deletetheEvent);

cusBookingRoutes.get('/getTotalBookingEvents/:customerID',customer, getTotallBookingCustomerBookings);


serviceVendorRoutes.get('/getServiceVendors/:customerId/:bookingId',customer,  getVendorsForCustomerBooking);
EventServiceRoutes.get('/getEventService', customer, getEventServices);
saveSelectedServiceRoutes.post('/saveServices', customer, saveSelectedServices);
tableArrangementRoutes.post('/createTableArrangement/:bookingid', customer, createArrangement);
reservationRoutes.post('/createReservation/:bookingid', customer, createReservation);
tableArrangementRoutes.get('/getTableArrangement/:bookingid', customer, getArrangementsByBooking);
tableArrangementRoutes.get('/get-table-designs',customer, getAllTableswithDesigns);


planBarRoutes.post('/planBar/:bookingid', customer, createPlanBarEvent);//did
planBarRoutes.get('/getPlanBar/:bookingid', customer, getPlanBarEvent);
planBarRoutes.delete('/deletePlanBar/:bookingid', customer, deletePlanBarEvent);
planBarRoutes.put('/updatePlanBar/:bookingid', customer, updatePlanBarEvent);
planBiteRoutes.get('/bite-menu-items', customer, getBiteMenuItems);
planBiteRoutes.post('/planBite/:bookingid', customer, createBiteMenu);
planBiteRoutes.get('/getPlanBite/:bookingid',customer, getBiteMenu);
planBiteRoutes.put('/updatePlanBite/:bookingid', customer, updateBiteMenu);
planBiteRoutes.delete('/deletePlanBite/:bookingid', customer, deleteBiteMenu);
BarArrangeRoutes.post('/liquor/:booking_id', customer,barController.addLiquorItem);
BarArrangeRoutes.post('/soft-drinks/:booking_id', customer,barController.addSoftDrinkItem);
BarArrangeRoutes.get('/barDetails/:booking_id',customer, barController.getBarDetails);
BarArrangeRoutes.put('/liquor/:booking_id/:item_id',customer, barController.updateLiquorItem);
BarArrangeRoutes.delete('/liquor/:booking_id/:item_id', customer,barController.deleteLiquorItem);
BarArrangeRoutes.put('/soft-drinks/:booking_id/:item_id',customer, barController.updateSoftDrinkItem);
BarArrangeRoutes.delete('/soft-drinks/:booking_id/:item_id',customer, barController.deleteSoftDrinkItem);

AdminRoutes.post('/assignToEvent', superAdmin, assignEmployeeToEvent);
AdminRoutes.get('/getAssignmentOptions',superAdmin, getAssignmentOptions);
AdminRoutes.get('/assignments',superAdmin, getAssignments);
AdminRoutes.put('/assignments/:id',superAdmin, updateAssignment);
AdminRoutes.delete('/assignments/:id',superAdmin, deleteAssignment);


AdminEventRoutes.post('/events',superAdmin, createEvent);
AdminEventRoutes.get('/events',superAdmin, getAllEvents);
AdminEventRoutes.get('/events/:id',superAdmin, getEventById);
AdminEventRoutes.put('/events/:id',superAdmin, updateEvent);
AdminEventRoutes.delete('/events/:id',superAdmin, deleteEvent);

AdminEventRoutes.get('/getAdminEventServices',superAdmin, getAllEventServices);
AdminEventRoutes.post('/createAdminEventService',superAdmin, createEventService);
AdminEventRoutes.put('/updateAdminEventService/:id',superAdmin, updateEventService);
AdminEventRoutes.delete('/deleteAdminEventService/:id',superAdmin, deleteEventService);
AdminEventRoutes.get('/getAdminEventServices/:id',superAdmin, getEventServiceById);
AdminEventRoutes.post('/uploadServiceImage',superAdmin, uploadServiceImage);

AdminEventRoutes.get('/getAllVendors',superAdmin, getAllVendors);
AdminEventRoutes.post('/createVendor',superAdmin, createVendor);
AdminEventRoutes.put('/updateVendor/:id',superAdmin, updateVendor);
AdminEventRoutes.delete('/deleteVendor/:id',superAdmin, deleteVendor);
AdminEventRoutes.get('/getAllVendors/:id',superAdmin, getVendorById);
AdminEventRoutes.get('/getVendorServices/:id',superAdmin, getVendorServices);
AdminEventRoutes.post('/assignServicesToVendor/:id',superAdmin, assignServicesToVendor);
AdminEventRoutes.get('/getAllEventServicesSimple',superAdmin, getAllEventServicesSimple);


AdminEventRoutes.get('/customer-event-services',superAdmin, getAllCustomerEventServices);
AdminEventRoutes.get('/customer-event-services/:id',superAdmin, getCustomerEventServiceById);
AdminEventRoutes.post('/customer-event-services',superAdmin, createCustomerEventService);
AdminEventRoutes.put('/customer-event-services/:id',superAdmin, updateCustomerEventService);
AdminEventRoutes.delete('/customer-event-services/:id',superAdmin, deleteCustomerEventService);
AdminEventRoutes.get('/getAllCustomers',superAdmin, getAllCustomers);
AdminEventRoutes.get('/getAllBookings',superAdmin, getAllBookings);
AdminEventRoutes.get('/getAllEventServicesCustomer',superAdmin, getAllEventServicesCustomer);


AdminEventRoutes.post('/createadminTableChair',superAdmin, createAdminArrangement);
AdminEventRoutes.get('/getadminTableChair',superAdmin, getAllArrangements);
AdminEventRoutes.get('/getadminTableChair/:id',superAdmin, getArrangementById);
AdminEventRoutes.put('/updateadminTableChair/:id',superAdmin, updateArrangement);
AdminEventRoutes.delete('/deleteadminTableChair/:id',superAdmin, deleteArrangement);
AdminEventRoutes.get('/geteventsForTable',superAdmin, getAllEventsForTable); // Assuming this is to get all events for table arrangements


AdminEventRoutes.post('/create-table-designs',superAdmin, createTableDesign);
AdminEventRoutes.get('/get-table-designs',superAdmin, getAllTableDesigns);
AdminEventRoutes.get('/get-table-designs/:id',superAdmin, getTableDesignById);
AdminEventRoutes.put('/update-table-designs/:id',superAdmin, updateTableDesign);
AdminEventRoutes.delete('/delete-table-designs/:id',superAdmin, deleteTableDesign);


// Bar Times CRUD
AdminEventRoutes.post('/bar-times',superAdmin, adminBarManagementController.createBar);
AdminEventRoutes.get('/bar-times',superAdmin, adminBarManagementController.getAllBars);
AdminEventRoutes.get('/bar-times/:id',superAdmin, adminBarManagementController.getBarById);
AdminEventRoutes.put('/bar-times/:id',superAdmin, adminBarManagementController.updateBar);
AdminEventRoutes.delete('/bar-times/:id',superAdmin, adminBarManagementController.deleteBar);

// Bite Menu CRUD
AdminEventRoutes.post('/bite-menu',superAdmin, adminBarManagementController.createBite);
AdminEventRoutes.get('/bite-menu',superAdmin, adminBarManagementController.getAllBites);
AdminEventRoutes.get('/bite-menu/bar/:barId',superAdmin, adminBarManagementController.getBitesByBar);
AdminEventRoutes.put('/bite-menu/:id',superAdmin, adminBarManagementController.updateBite);
AdminEventRoutes.delete('/bite-menu/:id',superAdmin, adminBarManagementController.deleteBite);

// Liquor Items (Alcohol) CRUD
AdminEventRoutes.post('/liquor-items',superAdmin, adminBarManagementController.createLiquorItem);
AdminEventRoutes.get('/liquor-items',superAdmin, adminBarManagementController.getAllLiquorItems);
AdminEventRoutes.get('/liquor-items/bar/:barId',superAdmin, adminBarManagementController.getLiquorByBar);
AdminEventRoutes.put('/liquor-items/:id',superAdmin, adminBarManagementController.updateLiquorItem);
AdminEventRoutes.delete('/liquor-items/:id',superAdmin, adminBarManagementController.deleteLiquorItem);

// Soft Drink Items CRUD
AdminEventRoutes.post('/soft-drink-items',superAdmin, adminBarManagementController.createSoftDrinkItem);
AdminEventRoutes.get('/soft-drink-items',superAdmin, adminBarManagementController.getAllSoftDrinkItems);
AdminEventRoutes.get('/soft-drink-items/bar/:barId',superAdmin, adminBarManagementController.getSoftDrinksByBar);
AdminEventRoutes.put('/soft-drink-items/:id',superAdmin, adminBarManagementController.updateSoftDrinkItem);
AdminEventRoutes.delete('/soft-drink-items/:id',superAdmin, adminBarManagementController.deleteSoftDrinkItem);


progressRoutes.get('/customerDashboard/:bookingId', customer, getEventProgress);
pdfRoutes.get('/events/:bookingId',downloadEventReport);
pdfRoutes.get('/booking-reports',getAllBookingReports);

export { eventRoute, weddingRoutes, cusBookingRoutes, dispayEventsRoutes, serviceVendorRoutes, EventServiceRoutes, saveSelectedServiceRoutes, tableArrangementRoutes, reservationRoutes, planBarRoutes, planBiteRoutes, BarArrangeRoutes, AdminRoutes, AdminEventRoutes, progressRoutes,pdfRoutes };