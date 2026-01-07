import { api } from "./auth.api";

export const getDashboardStats = async () => {
  try {
    const res = await api.get("/admin/dashboard-stats");
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getUsersWithReportsPaginated = async (
  page: number = 1,
  limit: number = 10
) => {
  try {
    const res = await api.get(
      `/admin/users-reports-paginated?page=${page}&limit=${limit}`
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const createSubzone = async (subzoneData: any) => {
  try {
    const res = await api.post("/admin/create-subzone", subzoneData);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getAllSubzones = async () => {
  try {
    const res = await api.get("/admin/get-all-subzones");
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const updateSubzone = async (id: string, subzoneData: any) => {
  try {
    const res = await api.put(`/admin/update-subzone/${id}`, subzoneData);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const deleteSubzone = async (id: string) => {
  try {
    const res = await api.delete(`/admin/delete-subzone/${id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const createFellowship = async (fellowshipData: any) => {
  try {
    const res = await api.post("/admin/create-fellowship", fellowshipData);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getAllFellowships = async () => {
  try {
    const res = await api.get("/admin/get-all-fellowships");
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const updateFellowship = async (id: string, fellowshipData: any) => {
  try {
    const res = await api.put(`/admin/update-fellowship/${id}`, fellowshipData);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const deleteFellowship = async (id: string) => {
  try {
    const res = await api.delete(`/admin/delete-fellowship/${id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const createNewUser = async (userData: any) => {
  try {
    const res = await api.post("/admin/create-user", userData);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getAllUsers = async () => {
  try {
    const res = await api.get("/admin/get-all-users");
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const updateUser = async (id: string, userData: any) => {
  try {
    const res = await api.put(`/admin/update-user/${id}`, userData);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const deleteUser = async (id: string) => {
  try {
    const res = await api.delete(`/admin/delete-user/${id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};
