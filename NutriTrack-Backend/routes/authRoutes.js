import express from "express";
import {
  register,
  login,
  forgotPassword,
  resetPassword,
  refreshToken,
  googleSignup,
  googleSignin,
} from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import passport from "../middleware/googleAuth.js";
import { User } from "../models/index.js"; 

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
//router.post("/promote-to-admin", authMiddleware, promoteToAdmin);
router.post("/refresh-token", refreshToken);

router.get("/protected", authMiddleware, (req, res) => {
  res.json({
    success: true,
    message: "You accessed a protected route!",
    user: req.user, // This contains user details from JWT token
  });
});

// 🔹 Google OAuth: Sign In
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    res.json({
      success: true,
      message: "Google authentication successful",
      token: req.user.token,  // Return JWT Token
      user: req.user.user,
    });
  }
);

// 🔹 Google OAuth: Sign Up 
router.post(
  "/google/signup",
  passport.authenticate("google-token", { session: false }),
  googleSignup
);

// 🔹 Google OAuth: Token Authentication for Frontend
router.post(
  "/google/token",
  passport.authenticate("google-token", { session: false }),
  (req, res) => {
    res.json({
      success: true,
      message: "Google token authentication successful",
      token: req.user.token,
      user: req.user.user,
    });
  }
);

// 🔹 Google Sign-In Route
router.post(
  "/google/signin",
  passport.authenticate("google-token", { session: false }),
  googleSignin
);

export default router;
