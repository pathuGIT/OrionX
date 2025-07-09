import express from "express";
import {
    getAllStructuredMenuSelections,
    getStructuredSelectionsByBookingId,
    getStructuredSelectionsByCustomerId,
    createMenuSelection,
    updateMenuSelection,
    deleteMenuSelection
} from "../controllers/AdminCorrectMenusController.js";

const router = express.Router();

// Get all menu selections in hierarchical structure
router.get("/structured", getAllStructuredMenuSelections);

// Get structured menu selections by booking ID
router.get("/structured/booking/:booking_id", getStructuredSelectionsByBookingId);

// Get structured menu selections by customer ID
router.get("/structured/customer/:customer_id", getStructuredSelectionsByCustomerId);

// Create a new menu selection
router.post("/", createMenuSelection);

// Update a menu selection
router.put("/:booking_id/:oldICMT_Id", updateMenuSelection);

// Delete a menu selection
router.delete("/:booking_id/:ICMT_Id", deleteMenuSelection);

export default router;