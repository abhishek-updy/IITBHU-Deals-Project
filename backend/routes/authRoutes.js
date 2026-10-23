import express from "express";
import { register, login, logout, getProfile, updateProfile } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import { registerRules, loginRules, handleValidation } from "../middleware/validate.js";

const router = express.Router();

// Public routes (No login required)
router.post("/register", registerRules, handleValidation, register);
router.post("/login", loginRules, handleValidation, login);

// Private routes (Student must be logged in to access these)
router.post("/logout", protect, logout);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

export default router;