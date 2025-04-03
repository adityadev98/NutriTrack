import request from "supertest";
import express from "express";
import router from "../routes/nutriRoutes.js";
// import { authMiddleware } from "../middleware/authMiddleware.js";
// import { trackfoodItem, getMealsConsumed, addCustomFoodItem, getCustomFoods } from "../controllers/nutriControllers.js";
// import { getNutrientHistory } from "../controllers/histController.js";

jest.mock("../middleware/authMiddleware.js", () => ({
  authMiddleware: jest.fn((req, res, next) => next()),
}));

jest.mock("../controllers/nutriControllers.js", () => ({
  trackfoodItem: jest.fn((req, res) => res.status(200).json({ message: "Food tracked successfully" })),
  getMealsConsumed: jest.fn((req, res) => res.status(200).json({ meals: [] })),
  addCustomFoodItem: jest.fn((req, res) => res.status(201).json({ message: "Custom food added" })),
  getCustomFoods: jest.fn((req, res) => res.status(200).json({ customFoods: [] })),
}));

jest.mock("../controllers/histController.js", () => ({
  getNutrientHistory: jest.fn((req, res) => res.status(200).json({ history: [] })),
}));

const app = express();
app.use(express.json());
app.use("/api/nutrition", router);

describe("Nutrition Routes", () => {
  test("POST /api/nutrition/track - should track food item", async () => {
    const response = await request(app).post("/api/nutrition/track").send({ food: "apple" });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Food tracked successfully");
  });

  test("POST /api/nutrition/customFood - should add custom food", async () => {
    const response = await request(app).post("/api/nutrition/customFood").send({ name: "Protein Shake" });
    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Custom food added");
  });

  test("GET /api/nutrition/getCustomFood - should fetch custom foods", async () => {
    const response = await request(app).get("/api/nutrition/getCustomFood");
    expect(response.status).toBe(200);
    expect(response.body.customFoods).toEqual([]);
  });

  test("GET /api/nutrition/mealsConsumed - should return meals consumed", async () => {
    const response = await request(app).get("/api/nutrition/mealsConsumed");
    expect(response.status).toBe(200);
    expect(response.body.meals).toEqual([]);
  });

  test("GET /api/nutrition/history - should return nutrient history", async () => {
    const response = await request(app).get("/api/nutrition/history");
    expect(response.status).toBe(200);
    expect(response.body.history).toEqual([]);
  });
});
