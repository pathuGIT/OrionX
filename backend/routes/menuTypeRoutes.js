import express from "express";
import MenuTypeController from "../controllers/menuTypeController.js";

const router = express.Router();

router.get("/", MenuTypeController.getAllMenuTypes);
router.get("/:id", MenuTypeController.getMenuTypeById);
router.post("/", MenuTypeController.createMenuType);
router.put("/:id", MenuTypeController.updateMenuType);
router.delete("/:id", MenuTypeController.deleteMenuType);

export default router;
