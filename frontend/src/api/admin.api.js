// User API Calls

import api from "../apiIntercepter";



export const getAllUsers = async () => {
    try {
        const res = await api.post("/get-all-users");
        return res.data;

    } catch (error) {
        throw error.response || error;

    }
};

// Create Subzone
export const createSubzone = async (subzoneData) => {
    try {
        const res = await api.post("/admin/create-subzone", subzoneData);
        console.log(res.data);
        return res.data;

    } catch (error) {
        throw error.response || error;

    }
};

// Get Subzone by ID
export const getSubzone = async (id) => {
    try {
        const res = await api.get(`/admin/get-subzone/${id}`);
        return res.data;

    } catch (error) {
        throw error.response || error;

    }
};

// Get All Subzones
export const getAllSubzones = async () => {
    try {
        const res = await api.get("/admin/get-all-subzones");
        return res.data;

    } catch (error) {
        throw error.response || error;

    }
};

// Update Subzone
export const updateSubzone = async (id, subzoneData) => {
    try {
        const res = await api.put(`/admin/update-subzone/${id}`, subzoneData);
        return res.data;

    } catch (error) {
        throw error.response || error;

    }
};

// Delete Subzone
export const deleteSubzone = async (id) => {
    try {
        const res = await api.delete(`/admin/delete-subzone/${id}`);
        return res.data;

    } catch (error) {
        throw error.response || error;

    }
};

// Create Fellowship
export const createFellowship = async (fellowshipData) => {
    try {
        const res = await api.post("/admin/create-fellowship", fellowshipData);
        console.log(res.data);
        return res.data;

    } catch (error) {
        throw error.response || error;

    }
};

// Create New User
export const createNewUser = async (userData) => {
    try {
        const res = await api.post("/admin/create-new-user", userData);

        return res.data;

    } catch (error) {
        throw error.response || error;

    }
};

// Get Dashboard Stats
export const getDashboardStats = async () => {
    try {
        const res = await api.get("/admin/dashboard-stats");
        return res.data;
    } catch (error) {
        throw error.response || error;
    }
};

// Get Subzones Paginated
export const getSubzonesPaginated = async (page = 1, limit = 10) => {
    try {
        const res = await api.get(`/admin/subzones-paginated?page=${page}&limit=${limit}`);
        return res.data;
    } catch (error) {
        throw error.response || error;
    }
};

// Get Fellowships Paginated
export const getFellowshipsPaginated = async (page = 1, limit = 10) => {
    try {
        const res = await api.get(`/admin/fellowships-paginated?page=${page}&limit=${limit}`);
        return res.data;
    } catch (error) {
        throw error.response || error;
    }
};

// Get Users with Reports Paginated
export const getUsersWithReportsPaginated = async (page = 1, limit = 10) => {
    try {
        const res = await api.get(`/admin/users-reports-paginated?page=${page}&limit=${limit}`);
        return res.data;
    } catch (error) {
        throw error.response || error;
    }
};

// Get Users Paginated
export const getUsersPaginated = async (page = 1, limit = 10) => {
    try {
        const res = await api.get(`/admin/users-paginated?page=${page}&limit=${limit}`);
        return res.data;
    } catch (error) {
        throw error.response || error;
    }
};