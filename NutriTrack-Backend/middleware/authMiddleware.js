import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../models/index.js";
import passport from "passport";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "nutritrackapp";

export const authMiddleware = async (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    console.log("🚨 No Authorization Header Found");
    return res
      .status(401)
      .json({ success: false, message: "No token, authorization denied!" });
  }

  const token = authHeader.split(" ")[1]; // Extract token from "Bearer <token>"

  if (!token) {
    console.log("🚨 Token Missing in Header");
    return res.status(401).json({ success: false, message: "Token missing!" });
  }

  console.log("🔹 Received Token:", token);

  try {
    if (token.startsWith("ey")) {
      // 🔹 Traditional JWT Authentication
      const decoded = jwt.verify(token, JWT_SECRET);
	  console.log("✅ Token Decoded Successfully:", decoded);
													  
      req.user = decoded;
	  console.log("✅ Middleware Passed. Moving to next function...");
      return next();
    } else {
      // 🔹 Google OAuth Token Authentication
      passport.authenticate("google-token", { session: false }, async (err, user) => {
        if (err || !user) {
          return res.status(401).json({ success: false, message: "Google authentication failed" });
        }
        req.user = user;
		console.log("✅ Google Auth - Middleware Passed. Moving to next function...");
        next();
      })(req, res, next);
    }
  } catch (error) {
    console.error("❌ JWT Verification Error:", error.message);
    return res
      .status(403)
      .json({ success: false, message: "Invalid or expired token!" });
  }
};
