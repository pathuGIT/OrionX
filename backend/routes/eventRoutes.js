// routes/eventRoutes.js
import express from 'express';
import { createEvent } from '../controllers/eventController.js'; // Named import
import { validateEvent } from '../middleware/validateEvent.js'; // Named import

const router = express.Router();

router.post('/', validateEvent, createEvent);

export default router;