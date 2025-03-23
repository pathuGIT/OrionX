import express from 'express';
import { getMenus,createMenu } from '../controllers/menuController.js';

const router = express.Router();

router.get("/", getMenus);
router.post("/", createMenu);

export default router;
