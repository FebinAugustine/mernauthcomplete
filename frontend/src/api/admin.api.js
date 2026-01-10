// User API Calls

import api from "../apiIntercepter";

// Region API Calls

// Create Region
export const createRegion = async (regionData) => {
    try {
        const res = await api.post("/admin/create-region", regionData);
        return res.data;
    } catch (error) {
        throw error.response || error;
    }
};

// Get Region by ID
export const getRegion = async (id) => {
    try {
        const res = await api.get(`/admin/get-region/${id}`);
        return res.data;
    } catch (error) {
        throw error.response || error;
    }
};

// Get All Regions
export const getAllRegions = async () => {
    try {
        const res = await api.get("/admin/get-all-regions");
        return res.data;
    } catch (error) {
        throw error.response || error;
    }
};

// Update Region
export const updateRegion = async (id, regionData) => {
    try {
        const res = await api.put(`/admin/update-region/${id}`, regionData);
        return res.data;
    } catch (error) {
        throw error.response || error;
    }
};

// Delete Region
export const deleteRegion = async (id) => {
    try {
        const res = await api.delete(`/admin/delete-region/${id}`);
        return res.data;
    } catch (error) {
        throw error.response || error;
    }
};

// Zone API Calls

// Create Zone
export const createZone = async (zoneData) => {
    try {
        const res = await api.post("/admin/create-zone", zoneData);
        return res.data;
    } catch (error) {
        throw error.response || error;
    }
};

// Get Zone by ID
export const getZone = async (id) => {
    try {
        const res = await api.get(`/admin/get-zone/${id}`);
        return res.data;
    } catch (error) {
        throw error.response || error;
    }
};

// Get All Zones
export const getAllZones = async () => {
    try {
        const res = await api.get("/admin/get-all-zones");
        return res.data;
    } catch (error) {
        throw error.response || error;
    }
};

// Update Zone
export const updateZone = async (id, zoneData) => {
    try {
        const res = await api.put(`/admin/update-zone/${id}`, zoneData);
        return res.data;
    } catch (error) {
        throw error.response || error;
    }
};

// Delete Zone
export const deleteZone = async (id) => {
    try {
        const res = await api.delete(`/admin/delete-zone/${id}`);
        return res.data;
    } catch (error) {
        throw error.response || error;
    }
};



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

// Get All Fellowships
export const getAllFellowships = async () => {
    try {
        const res = await api.get("/admin/get-all-fellowships");
        return res.data;
    } catch (error) {
        throw error.response || error;
    }
};

// Update Fellowship
export const updateFellowship = async (id, fellowshipData) => {
    try {
        const res = await api.put(`/admin/update-fellowship/${id}`, fellowshipData);
        return res.data;
    } catch (error) {
        throw error.response || error;
    }
};

// Delete Fellowship
export const deleteFellowship = async (id) => {
    try {
        const res = await api.delete(`/admin/delete-fellowship/${id}`);
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

// Update User
export const updateUser = async (id, userData) => {
    try {
        const res = await api.put(`/admin/update-user/${id}`, userData);
        return res.data;
    } catch (error) {
        throw error.response || error;
    }
};

// Delete User
export const deleteUser = async (id) => {
    try {
        const res = await api.delete(`/admin/delete-user/${id}`);
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
export const getSubzonesPaginated = async (page = 1, limit = 5) => {
    try {
        const res = await api.get(`/admin/subzones-paginated?page=${page}&limit=${limit}`);
        return res.data;
    } catch (error) {
        throw error.response || error;
    }
};

// Get Fellowships Paginated
export const getFellowshipsPaginated = async (page = 1, limit = 5) => {
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
export const getUsersPaginated = async (page = 1, limit = 5, search = '') => {
    try {
        const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
        if (search) params.append('search', search);
        const res = await api.get(`/admin/users-paginated?${params.toString()}`);
        return res.data;
    } catch (error) {
        throw error.response || error;
    }
};