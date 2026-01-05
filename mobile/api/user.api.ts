import { api } from "./auth.api";

export const getMyProfile = async () => {
  try {
    const res = await api.get("/me");
    return res.data.user;
  } catch (error) {
    throw error;
  }
};

export const updateUser = async (userData: any) => {
  try {
    const res = await api.put("/update", userData);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const changePassword = async (passwordData: {
  currentPassword: string;
  newPassword: string;
}) => {
  try {
    const res = await api.post("/change-password", passwordData);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    const res = await api.post("/logout");
    return res.data;
  } catch (error) {
    throw error;
  }
};
