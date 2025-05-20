import express from "express";
import { getAllMenuViews, getMenuViewById } from "../controllers/menuViewController.js";

const router = express.Router();

// Define the routes for menu views
router.get("/getAll", getAllMenuViews);
router.get("/get/:id", getMenuViewById);


export default router;