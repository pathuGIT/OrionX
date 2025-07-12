import express from 'express';
import { createEvents } from '../controllers/eventController.js';
//import { validateEvent } from '../middleware/validateEvent.js';
import { createWedding } from '../controllers/weddingController.js';
import { getCustomerBookings } from '../controllers/customerBookingController.js';
import { customer } from '../middleware/Customer.js';
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
cusBookingRoutes.get('/:customerID', getCustomerBookings);//controller -ashen(don't delete this line)
dispayEventsRoutes.get('/:customerID/:bookingID',  getPlannedEvents);
dispayEventsRoutes.put('/updateEvent/:Id',  updatetheEvent);
dispayEventsRoutes.delete('/deleteEvent/:Id',  deletetheEvent);


serviceVendorRoutes.get('/getServiceVendors/:customerId/:bookingId',  getVendorsForCustomerBooking);
EventServiceRoutes.get('/getEventService', customer, getEventServices);
saveSelectedServiceRoutes.post('/saveServices', customer, saveSelectedServices);
tableArrangementRoutes.post('/createTableArrangement/:bookingid', customer, createArrangement);
reservationRoutes.post('/createReservation/:bookingid', customer, createReservation);
tableArrangementRoutes.get('/getTableArrangement/:bookingid', customer, getArrangementsByBooking);
tableArrangementRoutes.get('/get-table-designs', getAllTableswithDesigns);


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

AdminEventRoutes.get('/getAllVendors', getAllVendors);
AdminEventRoutes.post('/createVendor', createVendor);
AdminEventRoutes.put('/updateVendor/:id', updateVendor);
AdminEventRoutes.delete('/deleteVendor/:id', deleteVendor);
AdminEventRoutes.get('/getAllVendors/:id', getVendorById);
AdminEventRoutes.get('/getVendorServices/:id', getVendorServices);
AdminEventRoutes.post('/assignServicesToVendor/:id', assignServicesToVendor);
AdminEventRoutes.get('/getAllEventServicesSimple', getAllEventServicesSimple);


AdminEventRoutes.get('/customer-event-services', getAllCustomerEventServices);
AdminEventRoutes.get('/customer-event-services/:id', getCustomerEventServiceById);
AdminEventRoutes.post('/customer-event-services', createCustomerEventService);
AdminEventRoutes.put('/customer-event-services/:id', updateCustomerEventService);
AdminEventRoutes.delete('/customer-event-services/:id', deleteCustomerEventService);
AdminEventRoutes.get('/getAllCustomers', getAllCustomers);
AdminEventRoutes.get('/getAllBookings', getAllBookings);
AdminEventRoutes.get('/getAllEventServicesCustomer', getAllEventServicesCustomer);


AdminEventRoutes.post('/createadminTableChair', createAdminArrangement);
AdminEventRoutes.get('/getadminTableChair', getAllArrangements);
AdminEventRoutes.get('/getadminTableChair/:id', getArrangementById);
AdminEventRoutes.put('/updateadminTableChair/:id', updateArrangement);
AdminEventRoutes.delete('/deleteadminTableChair/:id', deleteArrangement);
AdminEventRoutes.get('/geteventsForTable', getAllEventsForTable); // Assuming this is to get all events for table arrangements


AdminEventRoutes.post('/create-table-designs', createTableDesign);
AdminEventRoutes.get('/get-table-designs', getAllTableDesigns);
AdminEventRoutes.get('/get-table-designs/:id', getTableDesignById);
AdminEventRoutes.put('/update-table-designs/:id', updateTableDesign);
AdminEventRoutes.delete('/delete-table-designs/:id', deleteTableDesign);


// Bar Times CRUD
AdminEventRoutes.post('/bar-times', adminBarManagementController.createBar);
AdminEventRoutes.get('/bar-times', adminBarManagementController.getAllBars);
AdminEventRoutes.get('/bar-times/:id', adminBarManagementController.getBarById);
AdminEventRoutes.put('/bar-times/:id', adminBarManagementController.updateBar);
AdminEventRoutes.delete('/bar-times/:id', adminBarManagementController.deleteBar);

// Bite Menu CRUD
AdminEventRoutes.post('/bite-menu', adminBarManagementController.createBite);
AdminEventRoutes.get('/bite-menu', adminBarManagementController.getAllBites);
AdminEventRoutes.get('/bite-menu/bar/:barId', adminBarManagementController.getBitesByBar);
AdminEventRoutes.put('/bite-menu/:id', adminBarManagementController.updateBite);
AdminEventRoutes.delete('/bite-menu/:id', adminBarManagementController.deleteBite);

// Liquor Items (Alcohol) CRUD
AdminEventRoutes.post('/liquor-items', adminBarManagementController.createLiquorItem);
AdminEventRoutes.get('/liquor-items', adminBarManagementController.getAllLiquorItems);
AdminEventRoutes.get('/liquor-items/bar/:barId', adminBarManagementController.getLiquorByBar);
AdminEventRoutes.put('/liquor-items/:id', adminBarManagementController.updateLiquorItem);
AdminEventRoutes.delete('/liquor-items/:id', adminBarManagementController.deleteLiquorItem);

// Soft Drink Items CRUD
AdminEventRoutes.post('/soft-drink-items', adminBarManagementController.createSoftDrinkItem);
AdminEventRoutes.get('/soft-drink-items', adminBarManagementController.getAllSoftDrinkItems);
AdminEventRoutes.get('/soft-drink-items/bar/:barId', adminBarManagementController.getSoftDrinksByBar);
AdminEventRoutes.put('/soft-drink-items/:id', adminBarManagementController.updateSoftDrinkItem);
AdminEventRoutes.delete('/soft-drink-items/:id', adminBarManagementController.deleteSoftDrinkItem);


progressRoutes.get('/customerDashboard/:bookingId', customer, getEventProgress);
pdfRoutes.get('/events/:bookingId', downloadEventReport);
pdfRoutes.get('/booking-reports', getAllBookingReports);
export { eventRoute, weddingRoutes, cusBookingRoutes, dispayEventsRoutes, serviceVendorRoutes, EventServiceRoutes, saveSelectedServiceRoutes, tableArrangementRoutes, reservationRoutes, planBarRoutes, planBiteRoutes, BarArrangeRoutes, AdminRoutes, AdminEventRoutes, progressRoutes,pdfRoutes };