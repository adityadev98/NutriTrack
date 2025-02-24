import express from "express";
import verifyToken from '../verifyToken.js';
import {registeration} from "../controllers/nutriControllers.js";
import {login} from "../controllers/nutriControllers.js";
import {getallFoodItems } from "../controllers/nutriControllers.js";
import { getFoodItembyName } from "../controllers/nutriControllers.js";
import { trackfoodItem } from "../controllers/nutriControllers.js";
import { getNutrientHistory } from "../controllers/histController.js";
import { getMealsConsumed } from "../controllers/nutriControllers.js";
const router = express.Router();


//endpoint creation for registeration
router.post("/register",registeration)

//endpoint creation for login
router.post("/login", login)

// endpoint to track a food 
router.post("/track",trackfoodItem)

// endpoint to create custom food
// router.post("/customFood",addCustomFoodItem) 

// // endpoint to view meals consumed
router.get("/mealsConsumed", getMealsConsumed)


// Historical Weekly/Monthly View APIs

//endpoint to get history of food items
// Param: timeAgg (week/month) (Default: month)
// Param: startDate (YYYY-MM-DD) (Optional)
// Param: endDate (YYYY-MM-DD) (Optional)
router.get("/api/history",getNutrientHistory);

export default router;
