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
    details: {
        calories: { type: Number, required: true },
        protein: { type: Number },
        carbohydrates: { type: Number },
        fat: { type: Number },
        fiber: { type: Number },
    },
    quantity:{
        type:Number,
        min:1,
        required:true
    },
    servingUnit: { 
        type: String, 
        required: true 
    },
    createdAt: { type: Date, default: Date.now }
});

const customFoodModel = mongoose.model("customFood", customFoodSchema);
export default customFoodModel;
