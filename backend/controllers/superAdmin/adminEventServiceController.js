import adminEventService from '../../models/superAdmin/adminEventServiceModel.js';
import multer from 'multer';
import path from 'path';

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'service-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Image upload endpoint
export const uploadServiceImage = (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }
    
    const filePath = `/images/${req.file.filename}`;
    res.json({ filePath });
  });
};

// Get all event services
export const getAllEventServices = async (req, res) => {
  try {
    const events = await adminEventService.getAllEventServices();
    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Create event service
export const createEventService = async (req, res) => {
  try {
    const eventData = req.body;
    
    // Validate required fields
    if (!eventData.eventServiceName || !eventData.imagePath) {
      return res.status(400).json({ error: 'Service name and image are required' });
    }
    
    const newEvent = await adminEventService.createEventService(eventData);
    res.status(201).json(newEvent);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update event service
export const updateEventService = async (req, res) => {
  try {
    const { id } = req.params;
    const eventData = req.body;
    
    const updatedEvent = await adminEventService.updateEventService(id, eventData);
    res.json(updatedEvent);
  } catch (error) {
    if (error.message.startsWith('Event not found')) {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete event service
export const deleteEventService = async (req, res) => {
  try {
    const { id } = req.params;
    await adminEventService.deleteEventService(id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get service by ID
export const getEventServiceById = async (req, res) => {
  try {
    const service = await adminEventService.getEventServiceById(req.params.id);
    res.json(service);
  } catch (error) {
    if (error.message.startsWith('Service not found')) {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

export default {
  uploadServiceImage,
  getAllEventServices,
  createEventService,
  updateEventService,
  deleteEventService,
  getEventServiceById
};