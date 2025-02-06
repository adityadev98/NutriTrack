import mongoose from 'mongoose';

const userSchema= mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique: true
    },
    password:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        required:true,
        min:15
    }
},{timestamps:true})

const userModel = mongoose.model("users",userSchema);
export default userModel ;
