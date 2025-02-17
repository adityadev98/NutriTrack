import mongoose from 'mongoose';
import autoIncrement from 'mongoose-sequence';

const trackingSchema = mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users',
        required:true
    },
    foodId:{
        type:mongoose.Schema.Types.ObjectId,
        type: Number,
        unique: true

    },
    food_name: { // Store the name of the food item
        type: String,
        required: true
    },
    details:{
       
        calories:Number,
        protein:Number,
        carbohydrates:Number,
        fat:Number,
        fiber:Number,
       
    },
    eatenDate:{
        type:String,
        default:new Date().toLocaleDateString()
    },
    quantity:{
        type:Number,
        min:1,
        required:true
    },
    serving_unit: { // Store the unit used for tracking
        type: String,
        required: true
    },
    eaten_when: { // Stores meal type
        type: String,
        enum: ["breakfast", "AM snack", "lunch", "PM snack", "dinner"],
        required: true
    },
},{timestamps:true})

trackingSchema.plugin(autoIncrement(mongoose), { inc_field: 'foodId' });

const trackingModel = mongoose.model("trackings",trackingSchema);
export default trackingModel ;