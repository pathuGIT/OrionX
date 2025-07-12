// controllers/CombinedEventController.js
import AllEvent from '../../models/superAdmin/allEventsModel.js';

export const createEvent = async (req, res) => {
  try {
    const { eventType, data } = req.body;
    const result = await AllEvent.create(eventType, data);
    res.status(201).json({
      message: 'Event created successfully',
      eventId: result.eventId,
      typeId: result.typeId
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateEvent = async (req, res) => {
  try {
    // Structure data properly
    const eventData = {
      ...req.body,
      // Ensure details exists
      details: req.body.details || {}
    };

    // Clean up null values
    Object.keys(eventData).forEach(key => {
      if (eventData[key] === null || eventData[key] === 'null') {
        delete eventData[key];
      }
    });

    console.log('Updating event:', req.params.id, eventData);
    const updatedEvent = await AllEvent.update(req.params.id, eventData);
    
    res.json({ 
      message: 'Event updated successfully',
      event: updatedEvent
    });
  } catch (error) {
    console.error('Update error:', error);
    res.status(400).json({ 
      error: error.message || 'Update failed',
      details: error.stack // Include stack trace for debugging
    });
  }
};


export const deleteEvent = async (req, res) => {
  try {
    const { eventType } = req.body;
    await AllEvent.delete(req.params.id, eventType);
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getAllEvents = async (req, res) => {
  try {
    const events = await AllEvent.getAll();
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getEventById = async (req, res) => {
  try {
    const event = await AllEvent.getById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};