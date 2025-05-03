import express from 'express';
import { superAdmin } from '../middleware/Super_admin.js';
import { addVenue, checkVenuIdInBooking, createBooking, deleteVenueById, getAllVenue, getBooking, getVenueById, updateVenueById } from '../controllers/bookingController.js';


const router = express.Router();

router.post('/addVenue', superAdmin,  addVenue);
router.get('/getAllVenues', superAdmin,  getAllVenue);
// router.delete('/deleteVenueById', superAdmin,  deleteVenueById);
router.delete('/deleteVenueById/:id', superAdmin, deleteVenueById);
router.put('/updateVenueById', superAdmin, updateVenueById);
router.get('/getVenueById', superAdmin, getVenueById);
router.get('/checkBookingByVenueId/:venueId', checkVenuIdInBooking);

/////////////
router.post('/bookings', createBooking);
router.get('/bookings/:id', getBooking);
    

export default router;