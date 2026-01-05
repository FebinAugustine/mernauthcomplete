import axios from "axios";
import { getAuthData } from "../utils/auth";

const api = axios.create({
  baseURL: process.env.API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include CSRF token
api.interceptors.request.use(async (config) => {
  const authData = await getAuthData();
  if (authData?.csrfToken) {
    config.headers["x-csrf-token"] = authData.csrfToken;
  }
  return config;
});

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
  fellowship: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface VerifyData {
  email: string;
}

export interface VerifyOtpData {
  email: string;
  otp: string;
}

export const register = async (data: RegisterData) => {
  try {
    const response = await api.post("/register", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const login = async (data: LoginData) => {
  try {
    const response = await api.post("/login", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const verify = async (data: VerifyData) => {
  try {
    const response = await api.post("/verify", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const verifyOtp = async (data: VerifyOtpData) => {
  try {
    const response = await api.post("/verifyOtp", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await api.post("/logout");
    return response.data;
  } catch (error) {
    throw error;
  }
};
