import AdminCorrectMenusModel from "../models/AdminCorrectMenusModel.js";

// Get all menu selections in hierarchical structure
export const getAllStructuredMenuSelections = async (req, res) => {
  try {
    const selections = await AdminCorrectMenusModel.getStructuredMenuSelections();
    
    if (!selections || selections.length === 0) {
      return res.status(404).json({ 
        error: "No menu selections found",
        suggestion: "Check if any bookings have been made with menu selections"
      });
    }
    
    res.json(selections);
  } catch (error) {
    console.error("Error fetching structured menu selections:", error);
    res.status(500).json({ error: "Database error" });
  }
};

// Get structured menu selections by booking ID
export const getStructuredSelectionsByBookingId = async (req, res) => {
  try {
    const { booking_id } = req.params;
    const bookingSelections = await AdminCorrectMenusModel.getStructuredSelectionsByBookingId(booking_id);
    
    if (!bookingSelections) {
      return res.status(404).json({ 
        error: "No menu selections found for this booking",
        suggestion: "Check if the booking ID is correct or if menu selections have been made"
      });
    }
    
    res.json(bookingSelections);
  } catch (error) {
    console.error("Error fetching structured selections by booking ID:", error);
    res.status(500).json({ error: "Database error" });
  }
};

// Get structured menu selections by customer ID
export const getStructuredSelectionsByCustomerId = async (req, res) => {
  try {
    const { customer_id } = req.params;
    const customerSelections = await AdminCorrectMenusModel.getStructuredSelectionsByCustomerId(customer_id);
    
    // Check if customerSelections.bookings exists and has length
    if (!customerSelections || !customerSelections.bookings || customerSelections.bookings.length === 0) {
      return res.status(404).json({ 
        error: "No menu selections found for this customer",
        suggestion: "Check if the customer ID is correct or if the customer has any bookings with menu selections"
      });
    }
    
    res.json(customerSelections);
  } catch (error) {
    console.error("Error fetching structured selections by customer ID:", error);
    res.status(500).json({ error: "Database error" });
  }
};

// Create a new menu selection
export const createMenuSelection = async (req, res) => {
  const { booking_id, ICMT_Id } = req.body;
  
  try {
    if (!booking_id || !ICMT_Id) {
      return res.status(400).json({ error: "Both booking_id and ICMT_Id are required" });
    }

    // Check if selection already exists
    const exists = await AdminCorrectMenusModel.selectionExists(booking_id, ICMT_Id);
    if (exists) {
      return res.status(409).json({ error: "This menu item is already selected for this booking" });
    }

    const selectionId = await AdminCorrectMenusModel.createSelection(booking_id, ICMT_Id);
    res.status(201).json({ 
      message: "Menu selection created successfully",
      selectionId
    });
  } catch (error) {
    console.error("Error creating menu selection:", error);
    res.status(500).json({ error: "Database error" });
  }
};

// Update a menu selection
export const updateMenuSelection = async (req, res) => {
  const { booking_id, oldICMT_Id } = req.params;
  const { newICMT_Id } = req.body;
  
  try {
    if (!newICMT_Id) {
      return res.status(400).json({ error: "newICMT_Id is required" });
    }

    // Check if old selection exists
    const exists = await AdminCorrectMenusModel.selectionExists(booking_id, oldICMT_Id);
    if (!exists) {
      return res.status(404).json({ error: "Original menu selection not found" });
    }

    const affectedRows = await AdminCorrectMenusModel.updateSelection(
      oldICMT_Id, 
      booking_id, 
      newICMT_Id
    );

    if (affectedRows === 0) {
      return res.status(404).json({ error: "No changes made to the selection" });
    }

    res.json({ 
      message: "Menu selection updated successfully",
      booking_id,
      oldICMT_Id,
      newICMT_Id
    });
  } catch (error) {
    console.error("Error updating menu selection:", error);
    res.status(500).json({ error: "Database error" });
  }
};

// Delete a menu selection
export const deleteMenuSelection = async (req, res) => {
  const { booking_id, ICMT_Id } = req.params;
  
  try {
    const affectedRows = await AdminCorrectMenusModel.deleteSelection(booking_id, ICMT_Id);

    if (affectedRows === 0) {
      return res.status(404).json({ error: "Menu selection not found" });
    }

    res.json({ 
      message: "Menu selection deleted successfully",
      booking_id,
      ICMT_Id
    });
  } catch (error) {
    console.error("Error deleting menu selection:", error);
    res.status(500).json({ error: "Database error" });
  }
};

export default {
  getAllStructuredMenuSelections,
  getStructuredSelectionsByBookingId,
  getStructuredSelectionsByCustomerId,
  createMenuSelection,
  updateMenuSelection,
  deleteMenuSelection
};
