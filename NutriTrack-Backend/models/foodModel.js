import mongoose from 'mongoose';

const foodSchema= mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    calories:{
        type:String,
        required:true
    },
    protein:{
        type:String,
        required:true
    },
    fat:{
        type:String,
        required:true,
    },
    fiber:{
        type:String,
        required:true,
    },
    carbohydrate:{
        type:String,
        required:true,
    }
},{timestamps:true})

const foodModel = mongoose.model("foods",foodSchema);
export default foodModel ;
