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
