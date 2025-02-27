import {foodModel, trackingModel, customFoodModel} from '../models/index.js';

//basic idea: GET request
export const getallFoodItems =  async(req,res)=>{
    try{
        let foods = await foodModel.find();
        res.send(foods);
    } 
    catch(err){
        console.log(err);
        res.status(500).send({message:"Error in retreiving data"})

    }
}

//basic idea: GET request
export const getFoodItembyName = async(req,res)=>{
    try{
        let foods = await foodModel.find({name:{$regex:req.params.name,$options:'i'}});
        if(foods.length!=0)
        {
            res.send(foods);
        }
        else{
            res.status(404).send({message:"Food item doesnt exist"})
        }
        
    } 
    catch(err){
        console.log(err);
        res.status(500).send({message:"Error in retreiving data"})

    }
}

export const trackfoodItem = async (req,res)=>{
    
    let trackData = req.body;
   
    try 
    {
        let data = await trackingModel.create(trackData);
        console.log(data)
        res.status(201).send({message:"Food Added"});
    }
    catch(err)
    {
        console.log(err);
        res.status(500).send({message:"Some Problem in adding the food"})
    }
}

export const getMealsConsumed = async (req,res)=>{
    const getTodayDate = new Date().toLocaleDateString();
    try{
        const mealsConsumed = await trackingModel.find({ eatenDate: getTodayDate })
        .select('foodName details eatenWhen'); // Select only relevant fields
        if(mealsConsumed.length!=0)
        {
            res.send(mealsConsumed);
        }
        else{
            res.status(404).send({message:"No meals consumed for today"})
        }
        
    } 
    catch(err){
        console.log(err);
        res.status(500).send({message:"Error in retreiving data"})

    }
}
export const addCustomFoodItem = async (req,res)=>{
    
    let customFood = req.body;
   
    try 
    {
        let data = await customFoodModel.create(customFood);
        console.log(data)
        res.status(201).send({success:true, message:"Custom food Added",  data: data});
    }
    catch(err)
    {
        console.log(err);
        res.status(500).send({message:"Some Problem in adding the food"})
    }
}



export const getCustomFoods = async (req, res) => {
    try {
        const customFoods = await customFoodModel.find()
            .select('foodName details serving_unit serving_weight_grams'); // Select only relevant fields

        if (customFoods.length !== 0) {
            res.send(customFoods);
        } else {
            res.status(404).send({ message: "No custom meals found" });
        }

    } catch (err) {
        console.log(err);
        res.status(500).send({ message: "Error in retrieving data" });
    }
}
