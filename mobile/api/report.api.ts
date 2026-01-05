import { api } from "./auth.api";

export const getReportsByUser = async () => {
  try {
    const res = await api.get("/report-by-user");
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const createReport = async (reportData: any) => {
  try {
    const res = await api.post("/create", reportData);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const updateReportById = async (reportId: string, reportData: any) => {
  try {
    const res = await api.put(`/${reportId}`, reportData);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const deleteReportById = async (reportId: string) => {
  try {
    const res = await api.delete(`/${reportId}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};
