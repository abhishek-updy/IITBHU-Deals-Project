import express from "express";
import {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  verifyEmail,
  resendOTP,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import { registerRules, loginRules, handleValidation } from "../middleware/validate.js";
import { otpRateLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

// Public routes (No login required)
router.post("/register", registerRules, handleValidation, register);
router.post("/login", loginRules, handleValidation, login);

// Email verification (rate limit resend to 5 requests per 10 mins)
router.post("/verify-email", verifyEmail);
router.post("/resend-otp", otpRateLimiter(5, 10), resendOTP);

// Password reset (rate limit to 5 requests per 10 mins to protect email quota)
router.post("/forgot-password", otpRateLimiter(5, 10), forgotPassword);
router.put("/reset-password/:token", resetPassword);

// Private routes (Student must be logged in to access these)
router.post("/logout", protect, logout);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

export default router;
