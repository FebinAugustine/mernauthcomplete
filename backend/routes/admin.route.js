import express from "express";
import {
    createSubZone,
    getSubZone,
    getAllSubZones,
    updateSubZone,
    deleteSubZone,
} from "../controllers/subZone.controller.js";
import { authorizedAdmin, isAuth } from "../middlewares/isAuth.js";

const router = express.Router();

// Subzone routes
router.post("/create-subzone", isAuth, authorizedAdmin, createSubZone);
router.get("/get-subzone/:id", isAuth, authorizedAdmin, getSubZone);
router.get("/get-all-subzones", isAuth, authorizedAdmin, getAllSubZones);
router.put("/update-subzone/:id", isAuth, authorizedAdmin, updateSubZone);
router.delete("/delete-subzone/:id", isAuth, authorizedAdmin, deleteSubZone);

export default router;