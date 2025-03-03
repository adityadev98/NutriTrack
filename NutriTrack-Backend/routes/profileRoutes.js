import express from "express";
import { getProfile, profileSetup } from "../controllers/profileController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/profile/setup", authMiddleware, profileSetup);
router.get("/profile", authMiddleware, getProfile);

export default router;
