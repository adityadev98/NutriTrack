import express from "express";
import {
  register,
  login,
  forgotPassword,
  resetPassword,
  promoteToAdmin,
  refreshToken,
} from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/promote-to-admin", authMiddleware, promoteToAdmin);
router.post("/refresh-token", refreshToken);

router.get("/protected", authMiddleware, (req, res) => {
  res.json({
    success: true,
    message: "You accessed a protected route!",
    user: req.user, // This contains user details from JWT token
  });
});

export default router;
