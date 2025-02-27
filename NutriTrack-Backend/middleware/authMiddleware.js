import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "nutritrackapp";

export const authMiddleware = (req, res, next) => {



  const authHeader = req.header("Authorization");

  if (!authHeader) {
    console.log("🚨 No Authorization Header Found");
    return res.status(401).json({ success: false, message: "No token, authorization denied!" });
  }

  const token = authHeader.split(" ")[1]; // Extract token from "Bearer <token>"

  if (!token) {
    console.log("🚨 Token Missing in Header");
    return res.status(401).json({ success: false, message: "Token missing!" });
  }

  console.log("🔹 Received Token:", token);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("✅ Token Decoded Successfully:", decoded);
    req.user = decoded; // Attach user data from token
    next(); // Continue to next middleware/route
  } catch (error) {
    console.error("❌ JWT Verification Error:", error.message);
    return res.status(403).json({ success: false, message: "Invalid or expired token!" });
  }
};
