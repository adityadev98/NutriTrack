import request from "supertest";
import express from "express";
import adminRouter from "../routes/adminRoute.js"; // Adjust path to your adminRouter.js

// Mock dependencies
jest.mock("../middleware/authMiddleware.js", () => ({
  authMiddleware: jest.fn((req, res, next) => next()),
}));

jest.mock("../controllers/adminController.js", () => ({
  appointmentsAdmin: jest.fn((req, res) => res.status(200).json({ message: "Appointments fetched", data: [] })),
  appointmentCancel: jest.fn((req, res) => res.status(200).json({ message: "Appointment cancelled" })),
  allCoaches: jest.fn((req, res) => res.status(200).json({ message: "Coaches fetched", data: [] })),
  adminDashboard: jest.fn((req, res) => res.status(200).json({ message: "Dashboard data fetched", data: {} })),
  promoteToAdmin: jest.fn((req, res) => res.status(200).json({ message: "Promoted to admin" })),
  promoteToCoach: jest.fn((req, res) => res.status(200).json({ message: "Promoted to coach" })),
}));

jest.mock("../controllers/coachController.js", () => ({
  changeAvailablity: jest.fn((req, res) => res.status(200).json({ message: "Availability changed" })),
}));

const app = express();
app.use(express.json());
app.use("/api", adminRouter);

describe("Admin Routes", () => {
  test("GET /api/appointments - should fetch appointments", async () => {
    const response = await request(app).get("/api/appointments");
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Appointments fetched");
    expect(response.body.data).toEqual([]);
  });

  test("POST /api/cancel-appointment - should cancel an appointment", async () => {
    const response = await request(app)
      .post("/api/cancel-appointment")
      .send({ appointmentId: "12345" });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Appointment cancelled");
  });

  test("GET /api/all-coaches - should fetch all coaches", async () => {
    const response = await request(app).get("/api/all-coaches");
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Coaches fetched");
    expect(response.body.data).toEqual([]);
  });


  test("GET /api/dashboard - should fetch admin dashboard data", async () => {
    const response = await request(app).get("/api/dashboard");
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Dashboard data fetched");
    expect(response.body.data).toEqual({});
  });

  test("POST /api/promote-to-admin - should promote a user to admin", async () => {
    const response = await request(app)
      .post("/api/promote-to-admin")
      .send({ userId: "12345" });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Promoted to admin");
  });

  test("POST /api/promote-to-coach - should promote a user to coach", async () => {
    const response = await request(app)
      .post("/api/promote-to-coach")
      .send({ userId: "12345" });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Promoted to coach");
  });
});