import adminEventService from '../../models/superAdmin/adminEventServiceModel.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'public/images/';
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    cb(null, 'service-' + uniqueSuffix + extension);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed!'), false);
    }
  }
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
    
    // Return relative path for database storage
    const filePath = `/images/${req.file.filename}`;
    res.json({ filePath });
  });
};

// Create event service
export const createEventService = async (req, res) => {
  try {
    const { eventServiceName, imagePath } = req.body;
    
    // Validate required fields
    if (!eventServiceName || !imagePath) {
      return res.status(400).json({ error: 'Service name and image are required' });
    }
    
    const newEvent = await adminEventService.createEventService({
      eventServiceName,
      imagePath
    });
    
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
    const { eventServiceName, imagePath } = req.body;
    
    // Validate required fields
    if (!eventServiceName) {
      return res.status(400).json({ error: 'Service name is required' });
    }
    
    const updatedEvent = await adminEventService.updateEventService(id, {
      eventServiceName,
      imagePath
    });
    
    res.json(updatedEvent);
  } catch (error) {
    if (error.message.startsWith('Event not found')) {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete event service with image cleanup
export const deleteEventService = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get service first to get image path
    const service = await adminEventService.getEventServiceById(id);
    
    // Delete from database
    await adminEventService.deleteEventService(id);
    
    // Delete image file if exists
    if (service.image_path) {
      const imagePath = path.join('public', service.image_path);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
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

export const getAllEventServices = async (req, res) => {
  try {
    const events = await adminEventService.getAllEventServices();
    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Add this method to your existing controller
export const getAllEventServicesSimple = async (req, res) => {
    try {
        const events = await adminEventService.getAllEventServicesSimple();
        res.status(200).json(events);
    } catch (error) {
        console.error('Error fetching services:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export default {
  uploadServiceImage,
  getAllEventServices,
  createEventService,
  updateEventService,
  deleteEventService,
  getEventServiceById,
  getAllEventServicesSimple
};