import express from "express";
import {
    getSelections,
    getSelectionById,
    createSelection,
    deleteSelection
} from "../controllers/customerMenuSelectionController.js";

const router = express.Router();

// Routes for Customer_Menu_Item_Selection Table
router.get("/", getSelections);
router.get("/:customer_id/:ICMT_Id", getSelectionById);
router.post("/", createSelection);
router.delete("/:customer_id/:ICMT_Id", deleteSelection);

export default router;
