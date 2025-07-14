import CustomerMenuSelectionsModel from "../models/MenuCorrectionModel.js";

// Get all menu selections for a booking (flat structure with customer/booking details)
export const getMenuSelectionsForBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const selections = await CustomerMenuSelectionsModel.getMenuSelectionsByBooking(bookingId);
    
    if (!selections || selections.length === 0) {
      return res.status(404).json({ 
        error: "No menu selections found for this booking",
        suggestion: "Check if the booking ID is correct or if menu selections have been made"
      });
    }
    
    // Extract common customer and booking info from first item
    const response = {
      customer: {
        customer_id: selections[0].customer_id,
        customer_name: selections[0].customer_name,
        customer_email: selections[0].customer_email
      },
      booking: {
        booking_id: selections[0].booking_id,
        booking_date: selections[0].booking_date,
        time_slot: selections[0].time_slot,
        booking_status: selections[0].booking_status,
        booking_total_price: selections[0].booking_total_price,
        number_of_guests: selections[0].number_of_guests,
        additional_hours: selections[0].additional_hours
      },
      menu_selections: selections.map(selection => ({
        ICMT_Id: selection.ICMT_Id,
        item_id: selection.item_id,
        item_name: selection.item_name,
        menu_type_id: selection.menu_type_id,
        menu_type_name: selection.menu_type_name,
        menu_item_price: selection.menu_item_price,
        category_id: selection.category_id,
        category_name: selection.category_name,
        item_limit: selection.item_limit,
        menu_list_type_id: selection.menu_list_type_id,
        menu_list_name: selection.menu_list_name
      }))
    };
    
    res.json(response);
  } catch (error) {
    console.error("Error fetching menu selections:", error);
    res.status(500).json({ 
      error: "Database error",
      details: error.message 
    });
  }
};

// Get structured menu selections by booking ID (hierarchical format)
export const getStructuredMenuSelectionsForBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const structuredSelections = await CustomerMenuSelectionsModel.getStructuredMenuSelectionsByBooking(bookingId);
    
    if (!structuredSelections) {
      return res.status(404).json({ 
        error: "No menu selections found for this booking",
        suggestion: "Check if the booking ID is correct or if menu selections have been made"
      });
    }
    
    res.json(structuredSelections);
  } catch (error) {
    console.error("Error fetching structured menu selections:", error);
    res.status(500).json({ 
      error: "Database error",
      details: error.message 
    });
  }
};

// Create a new menu selection
export const createMenuSelection = async (req, res) => {
  const { bookingId, ICMT_Id } = req.body;
  
  try {
    if (!bookingId || !ICMT_Id) {
      return res.status(400).json({ 
        error: "Both bookingId and ICMT_Id are required",
        example_request: {
          body: {
            bookingId: "BID000011",
            ICMT_Id: "ICMT000045"
          }
        }
      });
    }

    // Check if selection already exists
    const exists = await CustomerMenuSelectionsModel.menuSelectionExists(bookingId, ICMT_Id);
    if (exists) {
      return res.status(409).json({ 
        error: "This menu item is already selected for this booking",
        solution: {
          suggestion: "If you want to change the selection, consider updating it",
          endpoint: "PATCH /api/orders/:bookingId/swap-choice",
          example: {
            oldICMT_Id: "ICMT000045",
            newICMT_Id: "ICMT000046"
          }
        }
      });
    }

    const selectionId = await CustomerMenuSelectionsModel.createMenuSelection(bookingId, ICMT_Id);
    
    // Get the full details of the newly created selection
    const [newSelection] = await CustomerMenuSelectionsModel.getMenuSelectionsByBooking(bookingId)
      .then(selections => selections.filter(s => s.ICMT_Id === ICMT_Id));
    
    res.status(201).json({ 
      message: "Menu selection created successfully",
      selection: {
        booking_id: bookingId,
        ICMT_Id,
        item_id: newSelection.item_id,
        item_name: newSelection.item_name,
        menu_type_name: newSelection.menu_type_name,
        category_name: newSelection.category_name
      },
      links: {
        view_all: `/api/orders/${bookingId}/choices`,
        view_structured: `/api/orders/${bookingId}/choices-details`
      }
    });
  } catch (error) {
    console.error("Error creating menu selection:", error);
    res.status(500).json({ 
      error: "Failed to create menu selection",
      details: error.message 
    });
  }
};

// Update/Swap a menu selection
export const updateMenuSelection = async (req, res) => {
  const { bookingId, oldICMT_Id } = req.params;
  const { newICMT_Id } = req.body;
  
  try {
    if (!newICMT_Id) {
      return res.status(400).json({ 
        error: "newICMT_Id is required",
        example_request: {
          params: { bookingId: "BID000011", oldICMT_Id: "ICMT000045" },
          body: { newICMT_Id: "ICMT000046" }
        }
      });
    }

    // Check if old selection exists
    const oldExists = await CustomerMenuSelectionsModel.menuSelectionExists(bookingId, oldICMT_Id);
    if (!oldExists) {
      return res.status(404).json({ 
        error: "Original menu selection not found",
        diagnostic: {
          bookingId,
          ICMT_Id: oldICMT_Id,
          exists: false
        }
      });
    }

    // Check if new selection already exists
    const newExists = await CustomerMenuSelectionsModel.menuSelectionExists(bookingId, newICMT_Id);
    if (newExists) {
      return res.status(409).json({ 
        error: "The new menu item is already selected for this booking",
        suggestion: "No need to swap - the item is already selected"
      });
    }

    const affectedRows = await CustomerMenuSelectionsModel.updateMenuSelection(
      bookingId,
      oldICMT_Id,
      newICMT_Id
    );

    if (affectedRows === 0) {
      return res.status(500).json({ 
        error: "Update operation completed but no rows were affected" 
      });
    }

    // Get details of both old and new items
    const selections = await CustomerMenuSelectionsModel.getMenuSelectionsByBooking(bookingId);
    const oldItem = selections.find(s => s.ICMT_Id === oldICMT_Id);
    const newItem = selections.find(s => s.ICMT_Id === newICMT_Id);

    res.json({ 
      message: "Menu selection updated successfully",
      change_summary: {
        booking_id: bookingId,
        from: {
          ICMT_Id: oldICMT_Id,
          item_name: oldItem?.item_name || "Unknown",
          category: oldItem?.category_name || "Unknown"
        },
        to: {
          ICMT_Id: newICMT_Id,
          item_name: newItem?.item_name || "Unknown",
          category: newItem?.category_name || "Unknown"
        }
      },
      view_updated_selections: {
        flat: `/api/orders/${bookingId}/choices`,
        structured: `/api/orders/${bookingId}/choices-details`
      }
    });
  } catch (error) {
    console.error("Error updating menu selection:", error);
    res.status(500).json({ 
      error: "Failed to update menu selection",
      details: error.message 
    });
  }
};

// Delete a specific menu selection
export const deleteMenuSelection = async (req, res) => {
  const { bookingId, ICMT_Id } = req.params;
  
  try {
    // Get item details before deletion
    const selections = await CustomerMenuSelectionsModel.getMenuSelectionsByBooking(bookingId);
    const itemToDelete = selections.find(s => s.ICMT_Id === ICMT_Id);

    if (!itemToDelete) {
      return res.status(404).json({ 
        error: "Menu selection not found",
        diagnostic: {
          bookingId,
          ICMT_Id,
          exists: false
        }
      });
    }

    const affectedRows = await CustomerMenuSelectionsModel.deleteMenuSelection(bookingId, ICMT_Id);

    res.json({ 
      message: "Menu selection deleted successfully",
      deleted_item: {
        ICMT_Id,
        item_name: itemToDelete.item_name,
        menu_type: itemToDelete.menu_type_name,
        category: itemToDelete.category_name
      },
      remaining_selections_count: selections.length - 1,
      actions: {
        view_remaining: `/api/orders/${bookingId}/choices`,
        delete_all: {
          method: "DELETE",
          endpoint: `/api/orders/${bookingId}/reset-choices`
        }
      }
    });
  } catch (error) {
    console.error("Error deleting menu selection:", error);
    res.status(500).json({ 
      error: "Failed to delete menu selection",
      details: error.message 
    });
  }
};

// Delete all menu selections for a booking
export const deleteAllMenuSelectionsForBooking = async (req, res) => {
  const { bookingId } = req.params;
  
  try {
    // Get count before deletion
    const selections = await CustomerMenuSelectionsModel.getMenuSelectionsByBooking(bookingId);
    const countBeforeDelete = selections.length;

    if (countBeforeDelete === 0) {
      return res.status(404).json({ 
        error: "No menu selections found for this booking",
        diagnostic: {
          bookingId,
          selections_exist: false
        }
      });
    }

    const affectedRows = await CustomerMenuSelectionsModel.deleteAllMenuSelectionsForBooking(bookingId);

    res.json({ 
      message: "All menu selections deleted successfully",
      summary: {
        booking_id: bookingId,
        items_deleted: countBeforeDelete,
        by_categories: selections.reduce((acc, item) => {
          acc[item.category_name] = (acc[item.category_name] || 0) + 1;
          return acc;
        }, {})
      },
      next_steps: {
        add_new_selections: {
          method: "POST",
          endpoint: `/api/orders/${bookingId}/add-choice`,
          example_body: { ICMT_Id: "ICMT000045" }
        }
      }
    });
  } catch (error) {
    console.error("Error deleting menu selections:", error);
    res.status(500).json({ 
      error: "Failed to delete menu selections",
      details: error.message 
    });
  }
};

export default {
  getMenuSelectionsForBooking,
  getStructuredMenuSelectionsForBooking,
  createMenuSelection,
  updateMenuSelection,
  deleteMenuSelection,
  deleteAllMenuSelectionsForBooking
};






