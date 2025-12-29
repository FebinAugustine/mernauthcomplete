
// Report Controller

import { Report } from "../models/Report.model.js";
import TryCatch from "../middlewares/TryCatch.js";
import sanitize from "mongo-sanitize";

export const createReport = TryCatch(async (req, res) => {
    const sanitezedBody = sanitize(req.body);
    const report = new Report({ ...sanitezedBody, user: req.user._id });
    if (!report.fellowship) {
        return res.status(400).json({
            message: "Fellowship is required",
        });
    }
    await report.save();
    res.status(201).json({
        message: "Report created successfully",
        report,
    });
});

export const getReport = TryCatch(async (req, res) => {
    const { id } = req.params;
    const report = await Report.findById(id).populate("user").populate("fellowship");
    if (!report) {
        return res.status(404).json({
            message: "Report not found",
        });
    }
    res.json({
        message: "Report found",
        report,
    });
});
export const updateReport = TryCatch(async (req, res) => {
    const { id } = req.params;

    const sanitezedBody = sanitize(req.body);
    const report = await Report.findByIdAndUpdate(id, sanitezedBody, {
        new: true,
        runValidators: true,
    });
    if (!report) {
        return res.status(404).json({
            message: "Report not found",
        });
    }
    res.json({
        message: "Report updated successfully",
        report,
    });
});

export const deleteReport = TryCatch(async (req, res) => {
    const { id } = req.params;
    const report = await Report.findByIdAndDelete(id);
    if (!report) {
        return res.status(404).json({
            message: "Report not found",
        });
    }
    res.json({
        message: "Report deleted successfully",
    });
});

export const getAllReports = TryCatch(async (req, res) => {
    const reports = await Report.find().populate("user").populate("fellowship");
    res.json({
        message: "Reports found",
        reports,
    });
});

export const getReportsByFellowship = TryCatch(async (req, res) => {
    const { fellowship } = req.params;
    const reports = await Report.find({ fellowship }).populate("user").populate("fellowship");
    res.json({
        message: "Reports found",
        reports,
    });
});

export const getReportsByStatus = TryCatch(async (req, res) => {
    const { status } = req.params;
    const reports = await Report.find({ status }).populate("user").populate("fellowship");
    res.json({
        message: "Reports found",
        reports,
    });
});

export const getReportsByFollowUpStatus = TryCatch(async (req, res) => {
    const { followUpStatus } = req.params;
    const reports = await Report.find({ followUpStatus }).populate("user").populate("fellowship");
    res.json({
        message: "Reports found",
        reports,
    });
});

export const getReportsByUser = TryCatch(async (req, res) => {
    const userId = req.user._id;
    const reports = await Report.find({ user: userId }).populate("user").populate("fellowship");
    res.json({
        message: "Reports found",
        reports,
    });
});

