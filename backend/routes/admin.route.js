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
import { createNewUser, getAllUsers, updateUser, deleteUser, getUser } from "../controllers/user.js";
import {
    getDashboardStats,
    getSubzonesPaginated,
    getFellowshipsPaginated,
    getUsersWithReportsPaginated,
    getUsersPaginated,
} from "../controllers/admin.controller.js";
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

// User routes can be added here similarly
router.post("/create-new-user", isAuth, authorizedAdmin, createNewUser);
router.get("/get-all-users", isAuth, authorizedAdmin, getAllUsers);
// get user by id, update user, delete user routes can be added here
router.put("/update-user/:id", isAuth, authorizedAdmin, updateUser);
router.delete("/delete-user/:id", isAuth, authorizedAdmin, deleteUser);
router.get("/get-user/:id", isAuth, authorizedAdmin, getUser);

// Dashboard routes
router.get("/dashboard-stats", isAuth, authorizedAdmin, getDashboardStats);
router.get("/subzones-paginated", isAuth, authorizedAdmin, getSubzonesPaginated);
router.get("/fellowships-paginated", isAuth, authorizedAdmin, getFellowshipsPaginated);
router.get("/users-reports-paginated", isAuth, authorizedAdmin, getUsersWithReportsPaginated);
router.get("/users-paginated", isAuth, authorizedAdmin, getUsersPaginated);

export default router;