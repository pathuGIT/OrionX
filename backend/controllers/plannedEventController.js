import plannedEvent from '../models/plannedEventModel.js'; // Import the plannedEvent model

export const getPlannedEvents = async (req, res) => {
    try {
        // Get customerID and bookingID from request parameters
        const { customerID, bookingID } = req.params;

        if (!customerID || !bookingID) {
            return res.status(400).json({ success: false, message: "Customer ID and Booking ID are required." });
        }

        // Pass both IDs to the model function
        const events = await plannedEvent.getPlannedEvent(customerID, bookingID);

        if (!events || events.length === 0) {
            return res.status(404).json({ success: false, message: "No event found for this customer and booking." });
        }

        res.status(200).json({ success: true, message: "Event retrieved successfully", data: events });
    } catch (error) {
        console.error("Error fetching planned event:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


export const updatetheEvent = async (req, res) => {
  try {
    const eventId = req.params.Id;
    const eventData = req.body;
    
    // Clean up null values
    Object.keys(eventData).forEach(key => {
      if (eventData[key] === null || eventData[key] === 'null' || eventData[key] === '') {
        eventData[key] = null;
      }
    });

    const updatedEvent = await plannedEvent.update(eventId, eventData);
    
    res.json({ 
      message: 'Event updated successfully',
      event: updatedEvent
    });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ 
      error: error.message || 'Update failed',
      details: error.stack
    });
  }
};


export const deletetheEvent = async (req, res) => {
  try {
    const eventId = req.params.Id;
    const eventData = req.body;
    
    // Clean up null values
    Object.keys(eventData).forEach(key => {
      if (eventData[key] === null || eventData[key] === 'null' || eventData[key] === '') {
        eventData[key] = null;
      }
    });

    const updatedEvent = await plannedEvent.delete(eventId, eventData);
    
    res.json({ 
      message: 'Event updated successfully',
      event: updatedEvent
    });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ 
      error: error.message || 'Update failed',
      details: error.stack
    });
  }
};

