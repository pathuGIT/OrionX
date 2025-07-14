import express from "express";
import {
  getMenuSelectionsForBooking,
  getStructuredMenuSelectionsForBooking,
  createMenuSelection,
  updateMenuSelection,
  deleteMenuSelection,
  deleteAllMenuSelectionsForBooking
} from "../controllers/MenuCorrectionController.js";

const router = express.Router();

// Menu Selection Management Routes

// Get all menu selections for a booking (flat structure)
router.get("/choices/:bookingId", getMenuSelectionsForBooking);

// Get structured menu selections (hierarchical format)
router.get("/choices-details/:bookingId", getStructuredMenuSelectionsForBooking);

// Add a new menu selection
router.post("/add-choice/:bookingId", createMenuSelection);

// Swap/update a menu selection
router.patch("/:bookingId/swap-choice/:oldICMT_Id", updateMenuSelection);

// Remove a specific menu selection
router.delete("/:bookingId/remove-choice/:ICMT_Id", deleteMenuSelection);

// Remove all menu selections for a booking
router.delete("/reset-choices/:bookingId", deleteAllMenuSelectionsForBooking);

export default router;