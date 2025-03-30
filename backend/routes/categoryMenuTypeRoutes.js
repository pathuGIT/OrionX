import express from "express";
import CategoryMenuTypeController from "../controllers/categoryMenuTypeController.js";

const router = express.Router();

// Get all category menu types
router.get("/getAll", CategoryMenuTypeController.getAllCategoryMenuTypes);

// Get a single category menu type by ID
router.get("/get/:id", CategoryMenuTypeController.getCategoryMenuTypeById);

// Create a new category menu type
router.post("/add", CategoryMenuTypeController.createCategoryMenuType);

// Update an existing category menu type
router.put("/update/:id", CategoryMenuTypeController.updateCategoryMenuType);

// Delete a category menu type
router.delete("/delete/:id", CategoryMenuTypeController.deleteCategoryMenuType);

export default router;
