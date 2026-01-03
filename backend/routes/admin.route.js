import express from "express";
import {
    createSubZone,
    getSubZone,
    getAllSubZones,
    updateSubZone,
    deleteSubZone,
} from "../controllers/subZone.controller.js";
import {
    createFellowship,
    getFellowship,
    updateFellowship,
    deleteFellowship,
    getAllFellowships,
} from "../controllers/fellowship.controller.js";
import { authorizedAdmin, isAuth } from "../middlewares/isAuth.js";

const router = express.Router();

// Subzone routes
router.post("/create-subzone", isAuth, authorizedAdmin, createSubZone);
router.get("/get-subzone/:id", isAuth, authorizedAdmin, getSubZone);
router.get("/get-all-subzones", isAuth, authorizedAdmin, getAllSubZones);
router.put("/update-subzone/:id", isAuth, authorizedAdmin, updateSubZone);
router.delete("/delete-subzone/:id", isAuth, authorizedAdmin, deleteSubZone);

// Fellowship routes can be added here similarly
router.post("/create-fellowship", isAuth, authorizedAdmin, createFellowship);
router.get("/get-fellowship/:id", isAuth, authorizedAdmin, getFellowship);
router.put("/update-fellowship/:id", isAuth, authorizedAdmin, updateFellowship);
router.delete("/delete-fellowship/:id", isAuth, authorizedAdmin, deleteFellowship);
router.get("/get-all-fellowships", isAuth, authorizedAdmin, getAllFellowships);


export default router;