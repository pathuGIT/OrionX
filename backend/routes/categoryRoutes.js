import express from "express";
import CategoryController from "../controllers/categoryController.js";

const router = express.Router();

router.get("/getAll", CategoryController.getAllCategories);
router.get("/get/:id", CategoryController.getCategoryById);
router.post("/add/", CategoryController.createCategory);
router.put("/update/:id", CategoryController.updateCategory);
router.delete("/delete/:id", CategoryController.deleteCategory);

export default router;
