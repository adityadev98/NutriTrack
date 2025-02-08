import userModel from '../models/userModel.js';
import foodModel from '../models/foodModel.js';
import trackingModel from '../models/trackingModel.js';

import mongoose from "mongoose";


// Controller to get aggregate nutrient history of the user
export const getNutrientHistory = async (req, res) => {
    try {
        const timeAgg = req.query.timeAgg || 'month'; // Default to 'monthly' if not provided

        let dateFormat;
        if (timeAgg === 'week') {
            dateFormat = "%Y-%U"; // Year and week number
        } else {
            dateFormat = "%Y-%m"; // Year and month
        }

        // Aggregate function to get the total calories, protein, fat, fiber, and carbohydrates consumed by the user in a month
        const trackings = await trackingModel.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId('67a64dc0ee7a29f5fb571ba8')
                }
            },
            {
                $lookup: {
                    from: 'foods',
                    localField: 'foodId',
                    foreignField: '_id',
                    as: 'foodDetails'
                }
            },
            {
                $unwind: '$foodDetails'
            },
            {
                $addFields: {
                    eatenDateObj: { $dateFromString: { dateString: "$eatenDate" } }
                }
            },
            {
                $addFields: {
                    aggTime: { $dateToString: { format: dateFormat, date: "$eatenDateObj" } }
                }
            },
            {
                $group: {
                    _id: "$aggTime",
                    totalCalories: {
                        $sum: {
                            $multiply: ["$quantity", "$foodDetails.calories"]
                        }
                    },
                    totalProtein: {
                        $sum: {
                            $multiply: ["$quantity", "$foodDetails.protein"]
                        }
                    },
                    totalFat: {
                        $sum: {
                            $multiply: ["$quantity", "$foodDetails.fat"]
                        }
                    },
                    totalFiber: {
                        $sum: {
                            $multiply: ["$quantity", "$foodDetails.fiber"]
                        }
                    },
                    totalCarbohydrate: {
                        $sum: {
                            $multiply: ["$quantity", "$foodDetails.carbohydrates"]
                        }
                    }

                }
            },
            {
                $project: {
                    _id: 0,
                    eatenDate: "$_id",
                    totalCalories: 1,
                    totalFibre: 1,
                    totalProtein: 1,
                    totalFat: 1,
                    totalCarbohydrate: 1,
                    timeAgg: timeAgg
                }
            }
        ]);

        res.status(200).json({
            status: 'success',
            results: trackings.length,
            data: {
                trackings
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};