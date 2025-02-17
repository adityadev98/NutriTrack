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
    foodName: { 
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
    servingUnit: { 
        type: String,
        required: true
    },
    eatenWhen: {
        type: String,
        enum: ["breakfast", "AM snack", "lunch", "PM snack", "dinner"],
        required: true
    },
},{timestamps:true})

trackingSchema.plugin(autoIncrement(mongoose), { inc_field: 'foodId' });

const trackingModel = mongoose.model("trackings",trackingSchema);
export default trackingModel ;