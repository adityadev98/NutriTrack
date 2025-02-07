import userModel from '../models/userModel.js';
import foodModel from '../models/foodModel.js';
import trackingModel from '../models/trackingModel.js';

// Controller to get all food items
export const getNutrientHistory = async (req, res) => {
    try {
        const foods = await foodModel.find();
        res.status(200).json({
            status: 'success',
            results: foods.length,
            data: {
                foods
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};