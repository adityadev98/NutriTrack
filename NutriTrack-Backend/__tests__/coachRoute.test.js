import request from "supertest";
import express from "express";
import coachRouter from "../routes/coachRoute.js";

jest.mock("../middleware/authMiddleware.js", () => ({
  authMiddleware: jest.fn((req, res, next) => next()),
}));

jest.mock("../controllers/coachController.js", () => ({
  appointmentsCoach: jest.fn((req, res) => res.status(200).json({ success: true, message: "Appointments fetched" })),
  appointmentCancel: jest.fn((req, res) => res.status(200).json({ success: true, message: "Appointment canceled" })),
  coachList: jest.fn((req, res) => res.status(200).json({ success: true, message: "Coach list fetched" })),
  changeAvailablity: jest.fn((req, res) => res.status(200).json({ success: true, message: "Availability updated" })),
  appointmentComplete: jest.fn((req, res) => res.status(200).json({ success: true, message: "Appointment completed" })),
  coachDashboard: jest.fn((req, res) => res.status(200).json({ success: true, message: "Coach dashboard data" })),
  coachProfile: jest.fn((req, res) => res.status(200).json({ success: true, message: "Coach profile data" })),
  updateCoachProfile: jest.fn((req, res) => res.status(200).json({ success: true, message: "Coach profile updated" })),
  updateCoach: jest.fn((req, res) => res.status(200).json({ success: true, message: "Coach updated" })),
}));

const app = express();
app.use(express.json());
app.use("/api/coach", coachRouter);

describe("Coach Routes", () => {
  test("POST /api/coach/cancel-appointment", async () => {
    const response = await request(app).post("/api/coach/cancel-appointment");
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Appointment canceled");
  });

  test("GET /api/coach/appointments", async () => {
    const response = await request(app).get("/api/coach/appointments");
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Appointments fetched");
  });

  test("GET /api/coach/list", async () => {
    const response = await request(app).get("/api/coach/list");
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Coach list fetched");
  });

  test("POST /api/coach/change-availability", async () => {
    const response = await request(app).post("/api/coach/change-availability");
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Availability updated");
  });

  test("POST /api/coach/complete-appointment", async () => {
    const response = await request(app).post("/api/coach/complete-appointment");
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Appointment completed");
  });

  test("GET /api/coach/dashboard", async () => {
    const response = await request(app).get("/api/coach/dashboard");
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Coach dashboard data");
  });

  test("GET /api/coach/profile", async () => {
    const response = await request(app).get("/api/coach/profile");
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Coach profile data");
  });

  test("POST /api/coach/update-profile", async () => {
    const response = await request(app).post("/api/coach/update-profile");
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Coach profile updated");
  });

  test("POST /api/coach/update-coach", async () => {
    const response = await request(app).post("/api/coach/update-coach");
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Coach updated");
  });
});
