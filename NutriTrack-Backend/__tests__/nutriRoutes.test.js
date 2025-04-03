import request from "supertest";
import express from "express";
import router from "../routes/nutriRoutes.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

// Mock controllers to simulate actual functionality
jest.mock("../controllers/nutriControllers.js", () => ({
  trackfoodItem: jest.fn((req, res) => res.status(200).send("Tracked food item")),
  addCustomFoodItem: jest.fn((req, res) => res.status(200).send("Custom food added")),
  getCustomFoods: jest.fn((req, res) => res.status(200).json([])),
  getMealsConsumed: jest.fn((req, res) => res.status(200).json([])),
  updateCustomFoodItem: jest.fn((req, res) => res.status(200).send("Custom food updated")),
  deleteCustomFoodItem: jest.fn((req, res) => res.status(200).send("Custom food deleted")),
}));

jest.mock("../controllers/histController.js", () => ({
  getNutrientHistory: jest.fn((req, res) => res.status(200).json([])),
}));

jest.mock("../middleware/authMiddleware.js", () => ({
  authMiddleware: (req, res, next) => next(),
}));

const app = express();
app.use(express.json());
app.use("/api", router); // Use the router from the provided code

describe("Nutri Routes Tests", () => {
  
  // Test for /track endpoint
  test("POST /track should track a food item", async () => {
    const response = await request(app)
      .post("/api/track")
      .set("Authorization", "Bearer mocktoken") // Mock Authorization header
      .send({ foodItem: "Apple", quantity: 1 });

    expect(response.status).toBe(200);
    expect(response.text).toBe("Tracked food item");
  });

  // Test for /customFood endpoint
  test("POST /customFood should add a custom food item", async () => {
    const response = await request(app)
      .post("/api/customFood")
      .set("Authorization", "Bearer mocktoken")
      .send({ foodName: "Homemade Pizza", calories: 300 });

    expect(response.status).toBe(200);
    expect(response.text).toBe("Custom food added");
  });

  // Test for /getCustomFood endpoint
  test("GET /getCustomFood should return custom foods", async () => {
    const response = await request(app)
      .get("/api/getCustomFood")
      .set("Authorization", "Bearer mocktoken");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  // Test for /mealsConsumed endpoint
  test("GET /mealsConsumed should return meals consumed", async () => {
    const response = await request(app)
      .get("/api/mealsConsumed")
      .set("Authorization", "Bearer mocktoken");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  // Test for /history endpoint
  test("GET /history should return nutrient history", async () => {
    const response = await request(app)
      .get("/api/history")
      .set("Authorization", "Bearer mocktoken")
      .query({ timeAgg: "week", startDate: "2025-01-01", endDate: "2025-01-07" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });
});
