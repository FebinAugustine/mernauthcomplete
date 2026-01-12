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
import {
    createRegion,
    getRegion,
    getAllRegions,
    updateRegion,
    deleteRegion,
} from "../controllers/region.controller.js";
import {
    createZone,
    getZone,
    getAllZones,
    updateZone,
    deleteZone,
} from "../controllers/zone.controller.js";
import { createNewUser, getAllUsers, updateUser, deleteUser, getUser } from "../controllers/user.js";
import {
    getDashboardStats,
    getSubzonesPaginated,
    getFellowshipsPaginated,
    getUsersWithReportsPaginated,
    getUsersPaginated,
    updateUserAdmin,
    deleteUserAdmin,

} from "../controllers/admin.controller.js";
import { isAuth, authAdmin, authorizedAdminOrRegional, authorizedAdminOrRegionalOrZonal, authorizedAdminOrRegionalOrZonalOrCoordinator, authorizedAdminOrRegionalOrZonalOrCoordinatorOrEvngCoordinator } from "../middlewares/isAuth.js";

const router = express.Router();

// Region routes
router.post("/create-region", isAuth, authAdmin, createRegion);
router.get("/get-region/:id", isAuth, authAdmin, getRegion);
router.get("/get-all-regions", isAuth, getAllRegions);
router.put("/update-region/:id", isAuth, authAdmin, updateRegion);
router.delete("/delete-region/:id", isAuth, authAdmin, deleteRegion);


// Zone routes
router.post("/create-zone", isAuth, authorizedAdminOrRegional, createZone);
router.get("/get-zone/:id", isAuth, authorizedAdminOrRegional, getZone);
router.get("/get-all-zones", isAuth, getAllZones);
router.put("/update-zone/:id", isAuth, authorizedAdminOrRegional, updateZone);
router.delete("/delete-zone/:id", isAuth, authorizedAdminOrRegional, deleteZone);


// Subzone routes
router.post("/create-subzone", isAuth, authorizedAdminOrRegionalOrZonal, createSubZone);
router.get("/get-subzone/:id", isAuth, authorizedAdminOrRegionalOrZonal, getSubZone);
router.get("/get-all-subzones", isAuth, authorizedAdminOrRegionalOrZonal, getAllSubZones);
router.put("/update-subzone/:id", isAuth, authorizedAdminOrRegionalOrZonal, updateSubZone);
router.delete("/delete-subzone/:id", isAuth, authorizedAdminOrRegionalOrZonal, deleteSubZone);

// Fellowship routes can be added here similarly
router.post("/create-fellowship", isAuth, authorizedAdminOrRegionalOrZonalOrCoordinatorOrEvngCoordinator, createFellowship);
router.get("/get-fellowship/:id", isAuth, authorizedAdminOrRegionalOrZonalOrCoordinatorOrEvngCoordinator, getFellowship);
router.put("/update-fellowship/:id", isAuth, authorizedAdminOrRegionalOrZonalOrCoordinatorOrEvngCoordinator, updateFellowship);
router.delete("/delete-fellowship/:id", isAuth, authorizedAdminOrRegionalOrZonalOrCoordinatorOrEvngCoordinator, deleteFellowship);
router.get("/get-all-fellowships", isAuth, authorizedAdminOrRegionalOrZonalOrCoordinatorOrEvngCoordinator, getAllFellowships);

// User routes can be added here similarly
router.post("/create-new-user", isAuth, authorizedAdminOrRegionalOrZonalOrCoordinator, createNewUser);
router.get("/get-all-users", isAuth, authorizedAdminOrRegionalOrZonalOrCoordinator, getAllUsers);
// get user by id, update user, delete user routes can be added here
router.put("/update-user/:id", isAuth, authorizedAdminOrRegionalOrZonalOrCoordinator, updateUserAdmin);
router.delete("/delete-user/:id", isAuth, authorizedAdminOrRegionalOrZonalOrCoordinator, deleteUserAdmin);
router.get("/get-user/:id", isAuth, authorizedAdminOrRegionalOrZonalOrCoordinator, getUser);

// Dashboard routes
router.get("/dashboard-stats", isAuth, authorizedAdminOrRegionalOrZonalOrCoordinator, getDashboardStats);
router.get("/subzones-paginated", isAuth, authorizedAdminOrRegionalOrZonalOrCoordinator, getSubzonesPaginated);
router.get("/fellowships-paginated", isAuth, authorizedAdminOrRegionalOrZonalOrCoordinator, getFellowshipsPaginated);
router.get("/users-reports-paginated", isAuth, authorizedAdminOrRegionalOrZonalOrCoordinator, getUsersWithReportsPaginated);
router.get("/users-paginated", isAuth, authorizedAdminOrRegionalOrZonalOrCoordinator, getUsersPaginated);

export default router;