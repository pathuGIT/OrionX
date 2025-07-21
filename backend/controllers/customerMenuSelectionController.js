import CustomerMenuItemSelection from "../models/customerMenuSelectionModel.js";

// Get all customer menu item selections
export const getSelections = async (req, res) => {
  try {
    const selections = await CustomerMenuItemSelection.getAllSelections();
    res.json(selections);
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
};

// Get a selection by booking_id and ICMT_Id
// export const getSelectionById = async (req, res) => {
//   try {
//     const { booking_id, ICMT_Id } = req.params;
//     const selection = await CustomerMenuItemSelection.getSelectionById(booking_id, ICMT_Id);

//     if (!selection) {
//       return res.status(404).json({ error: "Selection not found" });
//     }

//     res.json(selection);
//   } catch (error) {
//     res.status(500).json({ error: "Database error" });
//   }
// };

// Create a new selection
export const createSelection = async (req, res) => {
  const { booking_id, ICMT_Id } = req.body;
  try {
    if (!booking_id || !ICMT_Id) {
      return res.status(400).json({ error: "All fields are required" });
    }

    await CustomerMenuItemSelection.createSelection(booking_id, ICMT_Id);
    res.status(201).json({ message: "Selection created successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error inserting selection" });
  }
};

// Delete a selection
export const deleteSelection = async (req, res) => {
  try {
    const { booking_id, ICMT_Id } = req.params;

    const deletedRows = await CustomerMenuItemSelection.deleteSelection(booking_id, ICMT_Id);

    if (deletedRows === 0) {
      return res.status(404).json({ error: "Selection not found" });
    }

    res.json({ message: "Selection deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
};

export const getCustomerMenuSelections = async (req, res) => {
  try {
    const { booking_id } = req.params;

    const selections = await CustomerMenuItemSelection.getCustomerMenuSelections(booking_id);

    if (!selections) {
      return res.status(404).json({ error: "No selections found" });
    }

    res.json(selections);
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
};

// Delete all selections for a booking
export const deleteAllSelectionsForBooking = async (req, res) => {
  const { booking_id } = req.params;
  try {
    // Fix: Use different variable name (affectedRows instead of res)
    const affectedRows = await CustomerMenuItemSelection.deleteAllMenuSelectionsForBooking(booking_id);
    
    if (affectedRows === 0) {
      return res.status(404).json({ error: "No selections found" });
    }
    res.json({ message: "All selections deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
}

export const AdminDeleteMenuPriceFromBookingDetail = async (req, res) => {
  const { booking_id } = req.params;
  try {
    // Fix: Use different variable name (affectedRows instead of res)
    CustomerMenuItemSelection.AdminDeleteMenuPriceFromBookingDetail(booking_id);
    res.json({ message: "Menu price deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
}

// Check if booking_id exists in selections
export const checkBookingSelection = async (req, res) => {
  try {
    const { booking_id } = req.params;
    const exists = await CustomerMenuItemSelection.existsBookingSelection(booking_id);
    res.json({ exists });
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
};

export default { getSelections, createSelection, deleteSelection, checkBookingSelection };
