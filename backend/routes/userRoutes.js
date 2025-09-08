import express from "express";
import { loginController, signupController, authCheck } from "../controllers/authController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();
// Signup
router.post("/signup", signupController);

// Login
router.post("/login", loginController);

// Logout
router.post("/logout", protect(), async (req, res) => {
    res.json({ msg: "Logged out successfully" });
});

// Auth check endpoint
router.get("/auth/check", protect(), authCheck);

export default router;

