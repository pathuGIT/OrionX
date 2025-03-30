import express from "express";
import MenuTypeController from "../controllers/menuTypeController.js";

const router = express.Router();

router.get("/getAll", MenuTypeController.getAllMenuTypes);
router.get("/get/:id", MenuTypeController.getMenuTypeById);
router.post("/add", MenuTypeController.createMenuType);
router.put("/update/:id", MenuTypeController.updateMenuType);
router.delete("/delete/:id", MenuTypeController.deleteMenuType);

export default router;
