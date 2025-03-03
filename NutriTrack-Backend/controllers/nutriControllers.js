import { trackingModel, customFoodModel } from "../models/index.js";

export const trackfoodItem = async (req, res) => {
  let trackData = req.body;

  try {
    let data = await trackingModel.create(trackData);
    res.status(201).send({ success: true, message: "Food Added" });
  } catch (err) {
    res
      .status(500)
      .send({ failure: true, message: "Some Problem in adding the food" });
  }
};

export const getMealsConsumed = async (req, res) => {
  const getTodayDate = new Date().toLocaleDateString();
  try {
    const mealsConsumed = await trackingModel
      .find({ eatenDate: getTodayDate, userId: req.user.id })
      .select("foodName details eatenWhen");
    if (mealsConsumed.length != 0) {
      res.send({ success: true, data: mealsConsumed });
    } else {
      res
        .status(404)
        .send({ failure: true, message: "No meals consumed for today" });
    }
  } catch (err) {
    res
      .status(500)
      .send({ failure: true, message: "Error in retreiving data" });
  }
};
export const addCustomFoodItem = async (req, res) => {
  let customFood = req.body;

  try {
    let data = await customFoodModel.create(customFood);
    res
      .status(201)
      .send({ success: true, message: "Custom food Added", data: data });
  } catch (err) {
    res
      .status(500)
      .send({ failure: true, message: "Some Problem in adding custom food" });
  }
};

export const getCustomFoods = async (req, res) => {
  console.log(req.user);
  try {
    const customFoods = await customFoodModel
      .find({ userId: req.user.id })
      .select("foodName details serving_unit serving_weight_grams"); // Select only relevant fields

    if (customFoods.length !== 0) {
      res.send({ success: true, data: customFoods });
    } else {
      res.status(404).send({ failure: true, message: "No custom meals found" });
    }
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({ failure: true, message: "Error in retrieving data" });
  }
};
