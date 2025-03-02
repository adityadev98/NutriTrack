import {trackingModel} from '../models/index.js';

import mongoose from "mongoose";


// Controller to get aggregate nutrient history of the user
export const getNutrientHistory = async (req, res) => {
    try {
        const timeAgg = req.query.timeAgg || 'month'; // Default to 'monthly' if not provided
        const startDate = req.query.startDate ? new Date(req.query.startDate) : null;
        const endDate = req.query.endDate ? new Date(req.query.endDate) : null;

        console.log('Authenticated! Hi user: ' + req.user.id);

        const matchStage = {
            userId: new mongoose.Types.ObjectId(req.user.id)
        };

        if (startDate) {
            matchStage.eatenDateObj = { $gte: startDate };
        }

        if (endDate) {
            matchStage.eatenDateObj = matchStage.eatenDateObj || {};
            matchStage.eatenDateObj.$lte = endDate;
        }

        // Aggregate function to get the total calories, protein, fat, fiber, and carbohydrates consumed by the user in a month
        const trackings = await trackingModel.aggregate([
            {
                $addFields: {
                    eatenDateObj: { $dateFromString: { dateString: "$eatenDate" } }
                }
            },
            {
                $match: matchStage
            },
            {
                $addFields: {
                    aggTime: { $dateTrunc: { date: "$eatenDateObj" , unit: timeAgg } }
                }
            },
            {
                $group: {
                    _id: "$aggTime",
                    totalCalories: {
                        $sum: {
                            $multiply: ["$quantity", "$details.calories"]
                        }
                    },
                    totalProtein: {
                        $sum: {
                            $multiply: ["$quantity", "$details.protein"]
                        }
                    },
                    totalFat: {
                        $sum: {
                            $multiply: ["$quantity", "$details.fat"]
                        }
                    },
                    totalFiber: {
                        $sum: {
                            $multiply: ["$quantity", "$details.fiber"]
                        }
                    },
                    totalCarbohydrate: {
                        $sum: {
                            $multiply: ["$quantity", "$details.carbohydrates"]
                        }
                    }
                }
            },
            {
                $sort: { _id: 1 } // Sort by eatenDateObj in ascending order
            },
            {
                $project: {
                    _id: 0,
                    aggTime: "$_id",
                    totalCalories: 1,
                    totalFiber: 1,
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