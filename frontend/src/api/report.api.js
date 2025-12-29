//  Report API Calls

import api from "../apiIntercepter";

export const createReport = async (reportData) => {
    try {
        const res = await api.post("/create", reportData);
        return res.data;

    } catch (error) {
        throw error.response || error;

    }
};

// Get report by ID
export const getReportById = async (reportId) => {
    try {
        const res = await api.get(`/${reportId}`);
        return res.data;

    } catch (error) {
        throw error.response || error;

    }
};

// Update report
export const updateReportById = async (reportId, reportData) => {
    try {
        const res = await api.put(`/${reportId}`, reportData);
        return res.data;

    } catch (error) {
        throw error.response || error;

    }
};

// Delete report
export const deleteReportById = async (reportId) => {
    try {
        const res = await api.delete(`/${reportId}`);
        return res.data;

    } catch (error) {
        throw error.response || error;

    }
};

// Get all reports
export const getAllReports = async () => {
    try {
        const res = await api.get("/");
        return res.data;

    } catch (error) {
        throw error.response || error;

    }
};

// Get reports by fellowship
export const getReportsByFellowship = async (fellowship) => {
    try {
        const res = await api.get(`/fellowship/${fellowship}`);
        return res.data;

    } catch (error) {
        throw error.response || error;

    }
};

// Get reports by status
export const getReportsByStatus = async (status) => {
    try {
        const res = await api.get(`/status/${status}`);
        return res.data;

    } catch (error) {
        throw error.response || error;

    }
};

// Get reports by follow up status
export const getReportsByFollowUpStatus = async (followUpStatus) => {
    try {
        const res = await api.get(`/followup/${followUpStatus}`);
        return res.data;

    } catch (error) {
        throw error.response || error;

    }
};

// Get reports by user
export const getReportsByUser = async () => {
    try {
        const res = await api.get("/report-by-user");
        return res.data;

    } catch (error) {
        throw error.response || error;

    }
};