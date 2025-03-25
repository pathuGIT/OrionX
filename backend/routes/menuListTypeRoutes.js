import express from 'express';
import { getMenus, getMenuById, createMenu, updateMenu, deleteMenu } from '../controllers/menuListTypeController.js';

const router = express.Router();

router.get("/", getMenus);
router.get("/:menu_list_type_id", getMenuById);
router.post("/", createMenu);
router.put("/:menu_list_type_id", updateMenu);
router.delete("/:menu_list_type_id", deleteMenu);

export default router;
