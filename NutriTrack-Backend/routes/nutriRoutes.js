import express from "express";
import {authMiddleware} from '../middleware/authMiddleware.js';
import { trackfoodItem } from "../controllers/nutriControllers.js";
import { getNutrientHistory } from "../controllers/histController.js";
import { getMealsConsumed } from "../controllers/nutriControllers.js";
import {addCustomFoodItem} from "../controllers/nutriControllers.js";
import {getCustomFoods} from "../controllers/nutriControllers.js";

const router = express.Router();

// endpoint to track a food 
router.post("/track",authMiddleware,trackfoodItem)

// endpoint to create custom food
router.post("/customFood",authMiddleware,addCustomFoodItem) 

// endpoint to fetch custom food
router.get("/getCustomFood",authMiddleware,getCustomFoods)

// // endpoint to view meals consumed
router.get("/mealsConsumed",authMiddleware, getMealsConsumed)


// Historical Weekly/Monthly View APIs

//endpoint to get history of food items
// Param: timeAgg (week/month) (Default: month)
// Param: startDate (YYYY-MM-DD) (Optional)
// Param: endDate (YYYY-MM-DD) (Optional)
router.get("/history",authMiddleware, getNutrientHistory);

export default router;