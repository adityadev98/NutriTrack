import mongoose from 'mongoose';

const customFoodSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    foodName: { 
        type: String, 
        required: true 
    },
    serving_unit: { 
        type: String,
        required: true
    },
    serving_weight_grams:{
        type: Number,
        required: true
    },
    details: {
        calories: { type: Number, required: true },
        protein: { type: Number },
        carbohydrates: { type: Number },
        fat: { type: Number },
        fiber: { type: Number },
    },
    createdAt: { type: Date, default: Date.now }
});

const customFoodModel = mongoose.model("customFood", customFoodSchema);
export default customFoodModel;
