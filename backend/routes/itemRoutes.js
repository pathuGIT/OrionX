import express from "express";
import {
    getItems,
    getItem,
    createItem,
    updateItem,
    deleteItem,} from "../controllers/itemController.js";

const router = express.Router();

// Routes for Item Table
router.get("/getAll", getItems);
router.get("/get/:id", getItem);
router.post("/add/", createItem);
router.put("/update/:id", updateItem);
router.delete("/delete/:id", deleteItem);

export default router;