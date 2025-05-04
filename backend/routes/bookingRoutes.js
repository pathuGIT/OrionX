import express from 'express';
import { superAdmin } from '../middleware/Super_admin.js';
import { addVenue, checkVenuIdInBooking, createBooking, deleteVenueById, getAllVenue, getBooking, getBookingDetails, getBookings, getVenueById, updateBookingStatus, updateContract, updatePricing, updateVenueById } from '../controllers/bookingController.js';


const router = express.Router();

router.post('/addVenue', superAdmin,  addVenue);
router.get('/getAllVenues', superAdmin,  getAllVenue);
// router.delete('/deleteVenueById', superAdmin,  deleteVenueById);
router.delete('/deleteVenueById/:id', superAdmin, deleteVenueById);
router.put('/updateVenueById', superAdmin, updateVenueById);
router.get('/getVenueById', superAdmin, getVenueById);
router.get('/checkBookingByVenueId/:venueId', superAdmin, checkVenuIdInBooking);

/////////////
router.post('/bookings', createBooking);
router.get('/bookings/:id', getBooking);

//////////// Advance booking view routes
router.get('/',  getBookings); // ?status=confirmed|pending|done|...
router.get('/:id',  getBookingDetails);
router.put('/:id/status',  updateBookingStatus);
router.put('/:id/contract', updateContract);
router.put('/:id/pricing',  updatePricing);

export default router;