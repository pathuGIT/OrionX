import express from "express";
import {
    getSelections,
    createSelection,
    deleteSelection,
    checkBookingSelection, // <-- add this import
    getCustomerMenuSelections
} from "../controllers/customerMenuSelectionController.js";

const router = express.Router();

// Routes for Customer_Menu_Item_Selection Table
router.get("/", getSelections);
//router.get("/:customer_id/:ICMT_Id", getSelectionById);
router.post("/", createSelection);
router.delete("/:booking_id/:ICMT_Id", deleteSelection);

router.get("/getCustomerMenuSelections/:booking_id", getCustomerMenuSelections);

// Add this route before the :customer_id/:ICMT_Id routes to avoid route conflicts
router.get("/check-booking/:booking_id", checkBookingSelection);

export default router;
