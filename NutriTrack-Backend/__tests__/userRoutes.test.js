import request from "supertest";
import express from "express";
import userRouter from "../routes/userRoute.js"; 

// Mock controllers
jest.mock("../controllers/userController.js", () => ({
  bookAppointment: jest.fn((req, res) => res.status(201).json({ message: "Appointment booked successfully" })),
  listAppointment: jest.fn((req, res) => res.status(200).json([{ id: 1, date: "2025-01-01", status: "Confirmed" }])),
  cancelAppointment: jest.fn((req, res) => res.status(200).json({ message: "Appointment canceled successfully" })),
  paymentStripe: jest.fn((req, res) => res.status(200).json({ message: "Payment processed successfully" })),
  verifyStripe: jest.fn((req, res) => res.status(200).json({ message: "Payment verified successfully" })),
  listAvailableCoaches: jest.fn((req, res) => res.status(200).json({ success: true, coaches: [] })),
  chatWithGPT: jest.fn((req, res) => 
    res.status(200).json({
      success: true,
      reply: { role: "assistant", content: "Here’s a sample meal plan for today." }
    })
  ),
}));


// Mock authentication middleware
jest.mock("../middleware/authMiddleware.js", () => ({
  authMiddleware: (req, res, next) => next(),
}));

// Setup Express app
const app = express();
app.use(express.json());
app.use("/api", userRouter); // Mount the router under `/api`

describe("User Routes Tests", () => {
  
  // Test for /book-appointment
  test("POST /book-appointment should book an appointment", async () => {
    const response = await request(app)
      .post("/api/book-appointment")
      .set("Authorization", "Bearer mocktoken") // Simulated authentication
      .send({ doctorId: 123, date: "2025-04-10", time: "10:00 AM" });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ message: "Appointment booked successfully" });
  });

  // Test for /appointments
  test("GET /appointments should return a list of appointments", async () => {
    const response = await request(app)
      .get("/api/appointments")
      .set("Authorization", "Bearer mocktoken");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ id: 1, date: "2025-01-01", status: "Confirmed" }]);
  });

  // Test for /cancel-appointment
  test("POST /cancel-appointment should cancel an appointment", async () => {
    const response = await request(app)
      .post("/api/cancel-appointment")
      .set("Authorization", "Bearer mocktoken")
      .send({ appointmentId: 1 });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Appointment canceled successfully" });
  });

  // Test for /payment-stripe
  test("POST /payment-stripe should process a payment", async () => {
    const response = await request(app)
      .post("/api/payment-stripe")
      .set("Authorization", "Bearer mocktoken")
      .send({ amount: 5000, currency: "USD", paymentMethod: "card" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Payment processed successfully" });
  });

  // Test for /verifyStripe
  test("POST /verifyStripe should verify a payment", async () => {
    const response = await request(app)
      .post("/api/verifyStripe")
      .set("Authorization", "Bearer mocktoken")
      .send({ paymentIntentId: "pi_12345" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Payment verified successfully" });
  });
});
