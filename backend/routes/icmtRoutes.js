import express from "express";
import {
    getICMTs,
    getICMT,
    createICMT,
    updateICMT,
    deleteICMT
} from "../controllers/icmtController.js";

const router = express.Router();

// Routes for Item_Category_Menu_Type
router.get("/", getICMTs);
router.get("/:id", getICMT);
router.post("/", createICMT);
router.put("/:id", updateICMT);
router.delete("/:id", deleteICMT);

export default router;
