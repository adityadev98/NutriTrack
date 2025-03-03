import { MongoMemoryServer } from "mongodb-memory-server";
import trackingModel from "../models/trackingModel.js";
import customFoodModel from "../models/customFoodModel.js";
import userModel from "../models/user.js";
import jwt from "jsonwebtoken";
import express from "express";
import mongoose from "mongoose";
import request from "supertest";
import {
  trackfoodItem,
  getMealsConsumed,
  addCustomFoodItem,
  getCustomFoods,
} from "../controllers/nutriControllers.js";

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  req.user = { id: req.headers["user-id"] || null }; // Read from headers
  console.log("Mocked req.user:", req.user);
  next();
});
app.post("/api/track", trackfoodItem);
app.get("/api/mealsConsumed", getMealsConsumed);
app.post("/api/customFood", addCustomFoodItem);
app.get("/api/getCustomFood", getCustomFoods);

describe("NutriControllers", () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  });

  beforeEach(async () => {
    await trackingModel.deleteMany({});
    await userModel.deleteMany({});
  });

  describe("POST /api/track", () => {
    it("should add a food item", async () => {
      const res = await request(app)
        .post("/api/track")
        .send({
          userId: new mongoose.Types.ObjectId(),
          foodId: new mongoose.Types.ObjectId(),
          foodName: "banana",
          details: {
            calories: 60,
            protein: 2,
            carbohydrates: 20,
            fat: 1,
            fiber: 2,
          },
          eatenDate: new Date().toISOString().split("T")[0], // Ensure consistent date format
          quantity: 1,
          servingUnit: "grams",
          eatenWhen: "AM snack",
        });

      console.log("Response:", res.body); // Debugging output
      expect(res.statusCode).toEqual(201);
      expect(res.body).toStrictEqual({ success: true, message: "Food Added" });
    });

    it("should return 500 if there is an error", async () => {
      jest.spyOn(trackingModel, "create").mockImplementationOnce(() => {
        throw new Error("Test error");
      });
      const res = await request(app).post("/api/track").send({});

      console.log("Error Response:", res.body); // Debugging output
      expect(res.statusCode).toEqual(500);
      expect(res.body).toStrictEqual({
        failure: true,
        message: "Some Problem in adding the food",
      });
    });
  });

  describe("GET /api/mealsConsumed", () => {
    let userId, token;
    beforeAll(async () => {
      // Create a test user
      const user = await userModel.create({
        email: "test@example.com",
        password: "password123",
      });
      console.log("user Created:", user);
      userId = user._id.toString();
      console.log("User ID:", userId);

      // Generate JWT token
      token = jwt.sign({ id: userId, email: user.email }, "nutritrackapp", {
        expiresIn: "1h",
      });
    });
    it("should return meals consumed for today", async () => {
      const today = new Date().toLocaleDateString(); // Ensure consistent date format
      // Create a meal record for today
      const meal = await trackingModel.create({
        userId: userId,
        foodId: new mongoose.Types.ObjectId(),
        foodName: "banana",
        details: {
          calories: 60,
          protein: 2,
          carbohydrates: 20,
          fat: 1,
          fiber: 2,
        },
        eatenDate: today, // Matching today's date
        quantity: 1,
        servingUnit: "grams",
        eatenWhen: "AM snack",
      });

      console.log("Meal:", meal);
      console.log("Token before API call:", token);
      // Fetch meals consumed from the API
      const res = await request(app)
        .get("/api/mealsConsumed")
        .set("Authorization", `Bearer ${token}`)
        .set("user-id", userId);
      console.log("Response:", res.body);
      // Validate response
      expect(res.statusCode).toEqual(200);

      // Check that the response contains the expected structure and only relevant fields
      expect(res.body).toMatchObject({
        success: true,
        data: expect.any(Array),
      });

      // Check that the array contains at least one meal and the expected fields
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.data[0]).toMatchObject({
        foodName: "banana",
        details: expect.any(Object), // Assuming details are an object with specific keys
        eatenWhen: "AM snack",
      });
    });

    it("should return 404 if no meals consumed for today", async () => {
      const res = await request(app).get("/api/mealsConsumed");
      console.log("404 Error Response:", res.body);
      // Validate the no meals found scenario
      expect(res.statusCode).toEqual(404);
      expect(res.body).toStrictEqual({
        failure: true,
        message: "No meals consumed for today",
      });
    });

    it("should return 500 if there is an error", async () => {
      jest.spyOn(trackingModel, "find").mockImplementationOnce(() => {
        throw new Error("Test error");
      });

      const res = await request(app).get("/api/mealsConsumed");
      console.log("500 Error Response:", res.body);
      // Validate the error response
      expect(res.statusCode).toEqual(500);
      expect(res.body).toStrictEqual({
        failure: true,
        message: "Error in retreiving data",
      });
    });
  });

  describe("POST /api/customFood", () => {
    it("should add a custom food item", async () => {
      const res = await request(app)
        .post("/api/customFood")
        .send({
          userId: new mongoose.Types.ObjectId(),
          foodName: "custom banana",
          details: {
            calories: 60,
            protein: 2,
            carbohydrates: 20,
            fat: 1,
            fiber: 2,
          },
          serving_unit: "grams",
          serving_weight_grams: 100,
        });

      console.log("Response:", res.body);
      expect(res.statusCode).toEqual(201);
      expect(res.body).toMatchObject({
        message: "Custom food Added",
        success: true,
        data: expect.any(Object),
      });

      // Check that the array contains at least one meal and the expected fields
      expect(res.body.data).toMatchObject({
        foodName: "custom banana",
        details: {
          calories: 60,
          protein: 2,
          carbohydrates: 20,
          fat: 1,
          fiber: 2,
        },
        serving_unit: "grams",
        serving_weight_grams: 100,
      });
    });

    it("should return 500 if there is an error", async () => {
      jest
        .spyOn(customFoodModel, "create")
        .mockRejectedValueOnce(new Error("Test error"));

      const res = await request(app)
        .post("/api/customFood")
        .send({
          userId: new mongoose.Types.ObjectId(),
          foodName: "custom banana",
          details: {
            calories: 60,
            protein: 2,
            carbohydrates: 20,
            fat: 1,
            fiber: 2,
          },
          serving_unit: "grams",
          serving_weight_grams: 100,
        });

      console.log("Error Response:", res.body);
      expect(res.statusCode).toEqual(500);
      expect(res.body).toStrictEqual({
        failure: true,
        message: "Some Problem in adding custom food",
      });
    });
  });

  describe("GET /api/getCustomFood", () => {
    let userId, token;
    beforeAll(async () => {
      // Create a test user
      const user = await userModel.create({
        email: "test@example.com",
        password: "password123",
      });
      console.log("user Created:", user);
      userId = user._id.toString();
      console.log("User ID:", userId);

      // Generate JWT token
      token = jwt.sign({ id: userId, email: user.email }, "nutritrackapp", {
        expiresIn: "1h",
      });
    });

    it("should return custom foods", async () => {
      const insertedMeal = await customFoodModel.insertMany([
        {
          userId: userId,
          foodName: "Custom Banana",
          details: {
            calories: 60,
            protein: 2,
            carbohydrates: 20,
            fat: 1,
            fiber: 2,
          },
          serving_unit: "grams",
          serving_weight_grams: 100,
        },
        {
          userId: userId,
          foodName: "Custom Apple",
          details: {
            calories: 50,
            protein: 1,
            carbohydrates: 15,
            fat: 0,
            fiber: 1,
          },
          serving_unit: "grams",
          serving_weight_grams: 100,
        },
      ]);

      console.log("Inserted Meal:", insertedMeal);
      const res = await request(app)
        .get("/api/getCustomFood")
        .set("Authorization", `Bearer ${token}`)
        .set("user-id", userId);
      console.log("Response:", res.body);
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.success).toBe(true);
      expect(res.body.data[0]).toHaveProperty("foodName", "Custom Banana");
      expect(res.body.data[1]).toHaveProperty("foodName", "Custom Apple");
    });

    it("should return 404 if no custom foods found", async () => {
      const res = await request(app).get("/api/getCustomFood");
      console.log("Error Response:", res.body);
      expect(res.statusCode).toEqual(404);
      expect(res.body).toStrictEqual({
        failure: true,
        message: "No custom meals found",
      });
    });

    it("should return 500 if there is an error", async () => {
      jest.spyOn(customFoodModel, "find").mockImplementationOnce(() => {
        throw new Error("Test error");
      });
      const res = await request(app).get("/api/getCustomFood");
      console.log("Error Response:", res.body);
      expect(res.statusCode).toEqual(500);
      expect(res.body).toStrictEqual({
        failure: true,
        message: "Error in retrieving data",
      });
    });
  });
});
