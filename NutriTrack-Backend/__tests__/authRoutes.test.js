import request from "supertest";
import express from "express";
import router from "../routes/authRoutes.js";

jest.mock("../middleware/authMiddleware.js", () => ({
  authMiddleware: jest.fn((req, res, next) => next()),
}));

jest.mock("../middleware/googleAuth.js", () => ({
  authenticate: jest.fn(() => (req, res, next) => {
    req.user = { token: "mockToken", user: { id: "123" } };
    next();
  }),
}));

jest.mock("../controllers/authController.js", () => ({
  register: jest.fn((req, res) => res.status(201).json({ message: "User registered" })),
  login: jest.fn((req, res) => res.status(200).json({ token: "mockToken" })),
  forgotPassword: jest.fn((req, res) => res.status(200).json({ message: "Reset link sent" })),
  resetPassword: jest.fn((req, res) => res.status(200).json({ message: "Password reset successful" })),
  refreshToken: jest.fn((req, res) => res.status(200).json({ token: "newMockToken" })),
  googleSignup: jest.fn((req, res) => res.status(200).json({ message: "Google signup successful" })),
  googleSignin: jest.fn((req, res) => res.status(200).json({ message: "Google sign-in successful" })),
  generateAndSendOtp: jest.fn((req, res) => res.status(200).json({ message: "OTP sent" })),
  verifyOtp: jest.fn((req, res) => res.status(200).json({ message: "OTP verified" })),
}));

const app = express();
app.use(express.json());
app.use("/api/auth", router);

describe("Auth Routes", () => {
  test("POST /api/auth/register - should register a user", async () => {
    const response = await request(app).post("/api/auth/register").send({ email: "test@example.com", password: "password123" });
    expect(response.status).toBe(201);
    expect(response.body.message).toBe("User registered");
  });

  test("POST /api/auth/login - should login a user", async () => {
    const response = await request(app).post("/api/auth/login").send({ email: "test@example.com", password: "password123" });
    expect(response.status).toBe(200);
    expect(response.body.token).toBe("mockToken");
  });

  test("POST /api/auth/forgot-password - should send password reset link", async () => {
    const response = await request(app).post("/api/auth/forgot-password").send({ email: "test@example.com" });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Reset link sent");
  });

  test("POST /api/auth/reset-password/:token - should reset password", async () => {
    const response = await request(app).post("/api/auth/reset-password/mockToken").send({ password: "newPassword123" });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Password reset successful");
  });

  test("POST /api/auth/refresh-token - should refresh token", async () => {
    const response = await request(app).post("/api/auth/refresh-token");
    expect(response.status).toBe(200);
    expect(response.body.token).toBe("newMockToken");
  });

  test("POST /api/auth/google/signup - should handle Google signup", async () => {
    const response = await request(app).post("/api/auth/google/signup");
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Google signup successful");
  });

  test("POST /api/auth/google/signin - should handle Google sign-in", async () => {
    const response = await request(app).post("/api/auth/google/signin");
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Google sign-in successful");
  });

  test("POST /api/auth/generate-otp - should send OTP", async () => {
    const response = await request(app).post("/api/auth/generate-otp");
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("OTP sent");
  });

  test("POST /api/auth/verify-otp - should verify OTP", async () => {
    const response = await request(app).post("/api/auth/verify-otp");
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("OTP verified");
  });
  test("GET /api/auth/protected - should allow access to protected route", async () => {
    const response = await request(app).get("/api/auth/protected");
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("You accessed a protected route!");
  });
  test("GET /api/auth/google/callback - should authenticate user with Google OAuth", async () => {
    const response = await request(app).get("/api/auth/google/callback");
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Google authentication successful");
    expect(response.body.token).toBe("mockToken");
  });
  test("POST /api/auth/google/token - should authenticate user with Google token", async () => {
    const response = await request(app).post("/api/auth/google/token");
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Google token authentication successful");
    expect(response.body.token).toBe("mockToken");
  });
  jest.mock("../middleware/googleAuth.js", () => ({
    authenticate: jest.fn(() => (req, res, next) => {
      req.user = { token: "mockToken", user: { id: "123", email: "test@example.com" } };
      next();
    }),
  }));  
});
