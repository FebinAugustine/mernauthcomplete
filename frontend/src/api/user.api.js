// User API Calls

import api from "../apiIntercepter";

export const getMyProfile = async () => {
    try {
        const res = await api.get("/me");
        // console.log(res.data.user);
        const user = res.data.user;

        return user;

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

// Register user
export const registerUser = async (userData) => {
    try {
        const res = await api.post("/register", userData);
        return res.data;

    } catch (error) {
        throw error.response || error;

    }
};

// Verify user
export const verifyUser = async (token) => {
    try {
        const res = await api.post(`/verify/${token}`);
        return res.data;

    } catch (error) {
        throw error.response || error;

    }
};

// Login user
export const loginUser = async (loginData) => {
    try {
        const res = await api.post("/login", loginData);
        return res.data;

    } catch (error) {
        throw error.response || error;

    }
};

// Verify OTP
export const verifyOtp = async (otpData) => {
    try {
        const res = await api.post("/verify", otpData);
        return res.data;

    } catch (error) {
        throw error.response || error;

    }
};

// Refresh token
export const refreshToken = async () => {
    try {
        const res = await api.post("/refresh");
        return res.data;

    } catch (error) {
        throw error.response || error;

    }
};

// Update user
export const updateUser = async (userData) => {
    try {
        const res = await api.put("/update", userData);
        return res.data;

    } catch (error) {
        throw error.response || error;

    }
};

// Logout user
export const logoutUser = async () => {
    try {
        const res = await api.post("/logout");
        return res.data;

    } catch (error) {
        throw error.response || error;

    }
};

// Refresh CSRF
export const refreshCSRF = async () => {
    try {
        const res = await api.post("/refresh-csrf");
        return res.data;

    } catch (error) {
        throw error.response || error;

    }
};

// Admin controller
export const adminController = async () => {
    try {
        const res = await api.get("/admin");
        return res.data;

    } catch (error) {
        throw error.response || error;

    }
};

// Forgot password
export const forgotPassword = async (emailData) => {
    try {
        const res = await api.post("/forgot-password", emailData);
        return res.data;

    } catch (error) {
        throw error.response || error;

    }
};

// Reset password
export const resetPassword = async (token, passwordData) => {
    try {
        const res = await api.post(`/reset-password/${token}`, passwordData);
        return res.data;

    } catch (error) {
        throw error.response || error;

    }
};

// Change password
export const changePassword = async (passwordData) => {
    try {
        const res = await api.post("/change-password", passwordData);
        return res.data;

    } catch (error) {
        throw error.response || error;

    }
};