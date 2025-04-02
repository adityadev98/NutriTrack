import request from "supertest";
import express from "express";
import router from "../routes/profileRoutes.js"; 
import { authMiddleware } from "../middleware/authMiddleware.js";

// Mock controllers and middleware
jest.mock("../controllers/profileController.js", () => ({
  getProfile: jest.fn((req, res) => res.status(200).json({ username: "Test", email: "test@example.com" })),
  profileSetup: jest.fn((req, res) => res.status(200).send("Profile setup completed")),
}));

jest.mock("../middleware/authMiddleware.js", () => ({
  authMiddleware: (req, res, next) => next(), // Simulating successful authentication
}));

const app = express();
app.use(express.json());
app.use("/api", router); // Register the router from the provided code

describe("Profile Routes Tests", () => {
  
  // Test for /profile/setup endpoint
  test("POST /profile/setup should complete profile setup", async () => {
    const response = await request(app)
      .post("/api/profile/setup")
      .set("Authorization", "Bearer mocktoken") // Simulating authorization
      .send({
        username: "Test",
        email: "test@example.com",
        password: "password123",
      });

    expect(response.status).toBe(200);
    expect(response.text).toBe("Profile setup completed");
  });

  // Test for /profile endpoint
  test("GET /profile should return the user's profile", async () => {
    const response = await request(app)
      .get("/api/profile")
      .set("Authorization", "Bearer mocktoken") // Simulating authorization

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      username: "Test",
      email: "test@example.com",
    });
  });
});
