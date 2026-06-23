import { Router } from "express";
import { protect } from "../middleware/authMiddleware";
import {
  registerUser,
  loginUser,
  getMe,
} from "../controllers/authController";

const router = Router();

// ========================
// Auth Routes
// ========================
router.post("/register", registerUser);
router.post("/login", loginUser);

// ========================
// Protected Routes
// ========================

// Get current logged-in user
router.get("/me", protect, getMe);

export default router;