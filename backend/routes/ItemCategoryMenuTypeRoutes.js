import express from "express";
import {
    getItemCategoryMenuTypes,
    getItemCategoryMenuTypeById,
    createItemCategoryMenuType,
    updateItemCategoryMenuType,
    deleteItemCategoryMenuType,


} from "../controllers/ItemCategoryMenuTypController.js";

const router = express.Router();

// Routes for Item_Category_Menu_Type
router.get("/", getItemCategoryMenuTypes);
router.get("/:id", getItemCategoryMenuTypeById);
router.post("/", createItemCategoryMenuType);
router.put("/:id", updateItemCategoryMenuType);
router.delete("/:id", deleteItemCategoryMenuType);

export default router;
