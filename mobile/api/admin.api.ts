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
