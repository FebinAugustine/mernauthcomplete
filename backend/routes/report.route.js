// Report routes

import express from "express";
import {
    createReport,
    getReport,
    updateReport,
    deleteReport,
    getAllReports,
    getReportsByFellowship,
    getReportsByStatus,
    getReportsByFollowUpStatus,
    getReportsByUser,
} from "../controllers/report.controller.js";
import { isAuth } from "../middlewares/isAuth.js";
import { getAllFellowships } from "../controllers/fellowship.controller.js";

const router = express.Router();

router.post("/create", isAuth, createReport);
router.get("/", isAuth, getAllReports);
router.get("/fellowship/:fellowship", isAuth, getReportsByFellowship);
router.get("/status/:status", isAuth, getReportsByStatus);
router.get("/followup/:followUpStatus", isAuth, getReportsByFollowUpStatus);
router.get("/report-by-user", isAuth, getReportsByUser);
router.get("/:id", isAuth, getReport);
router.put("/:id", isAuth, updateReport);
router.delete("/:id", isAuth, deleteReport);


export default router;
