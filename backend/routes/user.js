import express from "express";
import {
  adminController,
  forgotPassword,
  loginUser,
  logoutUser,
  myProfile,
  refreshCSRF,
  refreshToken,
  registerUser,
  updateUser,
  verifyOtp,
  verifyUser,
  resetPassword,
  getAllUsers,
} from "../controllers/user.js";
import { authorizedAdmin, isAuth } from "../middlewares/isAuth.js";
import { verifyCSRFToken } from "../config/csrfMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/verify/:token", verifyUser);
router.post("/login", loginUser);
router.post("/verify", verifyOtp);
router.get("/me", isAuth, myProfile);
router.put("/update", isAuth, updateUser);
router.post("/refresh", refreshToken);
router.post("/logout", isAuth, verifyCSRFToken, logoutUser);
router.post("/refresh-csrf", isAuth, refreshCSRF);
router.get("/admin", isAuth, authorizedAdmin, adminController);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/get-all-users", isAuth, authorizedAdmin, getAllUsers);


export default router;
