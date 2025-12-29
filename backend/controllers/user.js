import { loginSchema, registerSchema } from "../config/zod.js";
import { redisClient } from "../index.js";
import TryCatch from "../middlewares/TryCatch.js";
import sanitize from "mongo-sanitize";
import { User } from "../models/User.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import sendMail from "../config/sendMail.js";
import { getOtpHtml, getVerifyEmailHtml } from "../config/html.js";
import {
  generateAccessToken,
  generateToken,
  revokeRefershToken,
  verifyRefreshToken,
} from "../config/generateToken.js";
import { generateCSRFToken } from "../config/csrfMiddleware.js";

export const registerUser = TryCatch(async (req, res) => {
  const sanitezedBody = sanitize(req.body);

  const validation = registerSchema.safeParse(sanitezedBody);

  if (!validation.success) {
    const zodError = validation.error;

    let firstErrorMessage = "Validation failed";
    let allErrors = [];

    if (zodError?.issues && Array.isArray(zodError.issues)) {
      allErrors = zodError.issues.map((issue) => ({
        field: issue.path ? issue.path.join(".") : "unknown",
        message: issue.message || "Validation Error",
        code: issue.code,
      }));

      firstErrorMessage = allErrors[ 0 ]?.message || "Validation Error";
    }
    return res.status(400).json({
      message: firstErrorMessage,
      error: allErrors,
    });
  }

  const { name, email, password, phone, fellowship } = validation.data;

  const rateLimitKey = `register-rate-limit:${req.ip}:${email}`;

  if (await redisClient.get(rateLimitKey)) {
    return res.status(429).json({
      message: "Too many requests, try again later",
    });
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(400).json({
      message: "User already exists",
    });
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const verifyToken = crypto.randomBytes(32).toString("hex");

  const verifyKey = `verify:${verifyToken}`;

  const datatoStore = JSON.stringify({
    name,
    email,
    password: hashPassword,
    phone,
    fellowship,
  });

  await redisClient.set(verifyKey, datatoStore, { EX: 300 });

  const subject = "verify your email for Account creation";
  const html = getVerifyEmailHtml({ email, token: verifyToken });

  await sendMail({ email, subject, html });

  await redisClient.set(rateLimitKey, "true", { EX: 60 });

  res.json({
    message:
      "If your email is valid, a verification like has been sent. it will expire in 5 minutes",
  });
});

export const verifyUser = TryCatch(async (req, res) => {
  const { token } = req.params;

  if (!token) {
    return res.status(400).json({
      message: "Verification token is required.",
    });
  }

  const verifyKey = `verify:${token}`;

  const userDataJson = await redisClient.get(verifyKey);

  if (!userDataJson) {
    return res.status(400).json({
      message: "Verification Link is expired.",
    });
  }

  await redisClient.del(verifyKey);

  const userData = JSON.parse(userDataJson);

  const existingUser = await User.findOne({ email: userData.email });

  if (existingUser) {
    return res.status(400).json({
      message: "User already exists",
    });
  }

  try {
    const newUser = await User.create({
      name: userData.name,
      email: userData.email,
      password: userData.password,
      phone: userData.phone,
      fellowship: userData.fellowship,
    });

    res.status(201).json({
      message: "Email verified successfully! your account has been created",
      user: { _id: newUser._id, name: newUser.name, email: newUser.email },
    });
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error
      const existingUser = await User.findOne({ email: userData.email });
      res.status(201).json({
        message: "Email verified successfully! your account has been created",
        user: { _id: existingUser._id, name: existingUser.name, email: existingUser.email },
      });
    } else {
      throw error;
    }
  }
});

export const loginUser = TryCatch(async (req, res) => {
  const sanitezedBody = sanitize(req.body);

  const validation = loginSchema.safeParse(sanitezedBody);

  if (!validation.success) {
    const zodError = validation.error;

    let firstErrorMessage = "Validation failed";
    let allErrors = [];

    if (zodError?.issues && Array.isArray(zodError.issues)) {
      allErrors = zodError.issues.map((issue) => ({
        field: issue.path ? issue.path.join(".") : "unknown",
        message: issue.message || "Validation Error",
        code: issue.code,
      }));

      firstErrorMessage = allErrors[ 0 ]?.message || "Validation Error";
    }
    return res.status(400).json({
      message: firstErrorMessage,
      error: allErrors,
    });
  }

  const { email, password } = validation.data;

  const rateLimitKey = `login-rate-limit:${req.ip}:${email}`;

  if (await redisClient.get(rateLimitKey)) {
    return res.status(429).json({
      message: "Too many requests, try again later",
    });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({
      message: "Invailid credentials",
    });
  }

  const comparePassword = await bcrypt.compare(password, user.password);

  if (!comparePassword) {
    return res.status(400).json({
      message: "Invailid credentials",
    });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const otpKey = `otp:${email}`;

  await redisClient.set(otpKey, JSON.stringify(otp), {
    EX: 300,
  });

  const subject = "Otp for verification";

  const html = getOtpHtml({ email, otp });

  await sendMail({ email, subject, html });

  await redisClient.set(rateLimitKey, "true", {
    EX: 60,
  });

  res.json({
    message:
      "If your email is vaid, an otp has been sent. it will be valid for 5 min",
  });
});

export const verifyOtp = TryCatch(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({
      message: "Please provide all details",
    });
  }

  const otpKey = `otp:${email}`;

  const storedOtpString = await redisClient.get(otpKey);

  if (!storedOtpString) {
    return res.status(400).json({
      message: "otp expired",
    });
  }

  const storedOtp = JSON.parse(storedOtpString);

  if (storedOtp !== otp) {
    return res.status(400).json({
      message: "Invalid Otp",
    });
  }

  await redisClient.del(otpKey);

  let user = await User.findOne({ email });

  const tokenData = await generateToken(user._id, res);

  res.status(200).json({
    message: `Welcome ${user.name}`,
    user,
    sessionInfo: {
      sessionId: tokenData.sessionId,
      loginTime: new Date().toISOString(),
      csrfToken: tokenData.csrfToken,
    },
  });
});

export const myProfile = TryCatch(async (req, res) => {
  const user = req.user;

  const sessionId = req.sessionId;

  const sessionData = await redisClient.get(`session:${sessionId}`);

  let sessionInfo = null;

  if (sessionData) {
    const parsedSession = JSON.parse(sessionData);
    sessionInfo = {
      sessionId,
      loginTime: parsedSession.createdAt,
      lastActivity: parsedSession.lastActivity,
    };
  }

  res.json({ user, sessionInfo });
});

export const refreshToken = TryCatch(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({
      message: "Invalid refresh token",
    });
  }

  const decode = await verifyRefreshToken(refreshToken);

  if (!decode) {
    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");
    res.clearCookie("csrfToken");

    return res.status(401).json({
      message: "Session Expired. Please login",
    });
  }

  generateAccessToken(decode.id, decode.sessionId, res);

  res.status(200).json({
    message: "token refreshed",
  });
});

export const logoutUser = TryCatch(async (req, res) => {
  const userId = req.user._id;

  await revokeRefershToken(userId);

  res.clearCookie("refreshToken");
  res.clearCookie("accessToken");
  res.clearCookie("csrfToken");

  await redisClient.del(`user:${userId}`);

  res.json({
    message: "Logged out successfully",
  });
});

export const refreshCSRF = TryCatch(async (req, res) => {
  const userId = req.user._id;

  const newCSRFToken = await generateCSRFToken(userId, res);

  res.json({
    message: "CSRF token refreshed successfully",
    csrfToken: newCSRFToken,
  });
});

export const adminController = TryCatch(async (req, res) => {
  res.json({
    message: "Hello admin",
  });
});

export const updateUser = TryCatch(async (req, res) => {
  const userId = req.user._id;
  const sanitezedBody = sanitize(req.body);
  const user = await User.findByIdAndUpdate(userId, sanitezedBody, {
    new: true,
    runValidators: true,
  });
  res.json({
    message: "User updated successfully",
    user,
  });
});

export const deleteUser = TryCatch(async (req, res) => {
  const userId = req.user._id;
  const user = await User.findByIdAndDelete(userId);
  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }
  res.json({
    message: "User deleted successfully",
  });
});

export const getAllUsers = TryCatch(async (req, res) => {
  const users = await User.find();
  res.json({
    message: "Users found",
    users,
  });
});

export const getUser = TryCatch(async (req, res) => {
  const userId = req.params.id;
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }
  res.json({
    message: "User found",
    user,
  });
});

export const forgotPassword = TryCatch(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      message: "Email is required",
    });
  }
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({
      message: "If your email is valid, a password reset link has been sent",
    });
  }
  const resetToken = crypto.randomBytes(32).toString("hex");

  const resetKey = `reset:${resetToken}`;

  const datatoStore = JSON.stringify({
    userId: user._id,
  });

  await redisClient.set(resetKey, datatoStore, { EX: 900 });

  const subject = "Password Reset Request";
  const resetLink = `https://yourfrontend.com/reset-password/${resetToken}`;
  const html = `<p>You requested for password reset. Click <a href="${resetLink}">here</a> to reset your password. This link will expire in 15 minutes.</p>`;

  await sendMail({ email, subject, html });

  res.json({
    message: "If your email is valid, a password reset link has been sent",
  });
});

export const resetPassword = TryCatch(async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({
      message: "Token and new password are required",
    });
  }
  const resetKey = `reset:${token}`;

  const userDataJson = await redisClient.get(resetKey);
  if (!userDataJson) {
    return res.status(400).json({
      message: "Reset link is expired or invalid",
    });
  }
  await redisClient.del(resetKey);

  const userData = JSON.parse(userDataJson);

  const user = await User.findById(userData.userId);
  if (!user) {
    return res.status(400).json({
      message: "User not found",
    });
  }

  const hashPassword = await bcrypt.hash(newPassword, 10);

  user.password = hashPassword;

  await user.save();

  res.json({
    message: "Password reset successfully",
  });
});