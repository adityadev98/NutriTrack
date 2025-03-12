//entry point for api
import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import cors from "cors";
import { nutriRoutes, authRoutes, profileRoutes, userRoutes, adminRoutes, coachRoutes} from "./routes/index.js";

dotenv.config();

console.log(process.env.MONGO_URI);
const PORT = process.env.VITE_PORT || 5000;

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", nutriRoutes);
app.use("/api/user", profileRoutes);

// Nutri Coach Booking Routes
app.use("/api/booking", userRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/coach", coachRoutes)

app.listen(PORT, () => {
  connectDB();
  console.log("✅ Server is up and running @ http://localhost:", PORT);
});

// Setting proper security headers.
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  res.setHeader("Cross-Origin-Embedder-Policy", "credentialless");
  next();
});
