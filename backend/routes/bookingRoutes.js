import express from 'express';
import { superAdmin } from '../middleware/Super_admin.js';
import { addVenue, deleteVenueById, getAllVenue, getVenueById, updateVenueById } from '../controllers/bookingController.js';


const router = express.Router();

router.post('/addVenue', superAdmin,  addVenue);
router.get('/getAllVenues', superAdmin,  getAllVenue);
router.delete('/deleteVenueById', superAdmin,  deleteVenueById);
router.put('/updateVenueById', superAdmin, updateVenueById);
router.get('/getVenueById', superAdmin, getVenueById);
    

export default router;