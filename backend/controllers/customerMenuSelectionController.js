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

// Get a selection by customer_id and ICMT_Id
export const getSelectionById = async (req, res) => {
  try {
    const { customer_id, ICMT_Id } = req.params;
    const selection = await CustomerMenuItemSelection.getSelectionById(customer_id, ICMT_Id);

    if (!selection) {
      return res.status(404).json({ error: "Selection not found" });
    }

    res.json(selection);
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
};

// Create a new selection
export const createSelection = async (req, res) => {
  const { customer_id, ICMT_Id } = req.body;
  try {
    if (!customer_id || !ICMT_Id) {
      return res.status(400).json({ error: "All fields are required" });
    }

    await CustomerMenuItemSelection.createSelection(customer_id, ICMT_Id);
    res.status(201).json({ message: "Selection created successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error inserting selection" });
  }
};

// Delete a selection
export const deleteSelection = async (req, res) => {
  try {
    const { customer_id, ICMT_Id } = req.params;

    const deletedRows = await CustomerMenuItemSelection.deleteSelection(customer_id, ICMT_Id);

    if (deletedRows === 0) {
      return res.status(404).json({ error: "Selection not found" });
    }

    res.json({ message: "Selection deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
};

export default { getSelections, getSelectionById, createSelection, deleteSelection };
