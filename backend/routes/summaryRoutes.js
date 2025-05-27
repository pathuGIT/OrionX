import express from "express";
import {
    getSummary
} from "../controllers/summaryController.js";

const router = express.Router();

// Route for Booking Summary
router.get("/:booking_id", getSummary);

export default router;
