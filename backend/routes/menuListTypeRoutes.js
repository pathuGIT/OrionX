import express from 'express';
import { getMenuListType, getMenuById, createMenu, updateMenuById, deleteMenu } from '../controllers/menuListTypeController.js';

const router = express.Router();

router.get("/getAll", getMenuListType);
router.get("/get/:id", getMenuById);
router.post("/add", createMenu);
router.put("/update/:id", updateMenuById);
router.delete("/delete/:id", deleteMenu);

export default router;
