import express from "express";
import {
    getItems,
    getItem,
    createItem,
    updateItem,
    deleteItem,} from "../controllers/itemController.js";

const router = express.Router();

// Routes for Item Table
router.get("/", getItems);
router.get("/:id", getItem);
router.post("/", createItem);
router.put("/:id", updateItem);
router.delete("/:id", deleteItem);

export default router;