import { useEffect, useState } from "react";
import { useNavigate,useLocation } from 'react-router-dom';

import { Grid, Box, Button, Input, Select, Text, HStack, Heading } from "@chakra-ui/react";
import '../App.css';


interface FoodProps {
    food?: {
        foodName: string;
        details: {
            calories: number;
            protein: number;
            carbohydrates: number;
            fat: number;
            fiber: number;
        };
        serving_unit: string;
        serving_weight_grams: number;
        _id?: string;
    };
}

const FoodItem: React.FC<FoodProps> = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const defaultFood = {
        foodName: '',
        details: {
          calories: 0,
          protein: 0,
          carbohydrates: 0,
          fat: 0,
          fiber: 0,
        },
        serving_unit: '',
        serving_weight_grams: 0,
      };
    const food = (location.state && location.state.food) || defaultFood;
    const [eatenQuantity, setEatenQuantity] = useState<number>(food.serving_weight_grams);
    const [foodInitial, setFoodInitial] = useState<Required<FoodProps>["food"]>(food);
    const [foodData, setFoodData] = useState<Required<FoodProps>["food"]>(food);
    const [selectedWhen, setSelectedWhen] = useState<string>("breakfast");

  
    useEffect(() => {
        setFoodData(food);
        setFoodInitial(food);
    }, [food]);
    console.log(food);
   
    function calculateMacros(event: React.ChangeEvent<HTMLInputElement>) {
        let quantity = Number(event.target.value);
        if (quantity > 0) {
            // const selectedMeasure = food.serving_unit;
            const servingWeight = food.serving_weight_grams;
            const convertedQuantity = (servingWeight * quantity);
            
            console.log("servingWeight:", servingWeight);
            console.log("convertedQuantity:", convertedQuantity);
            console.log("food.serving_unit", food.serving_unit);

            setEatenQuantity(quantity);

            let updatedDetails = { 
                    protein: Math.round(foodInitial.details.protein * quantity ),
                    carbohydrates: Math.round(foodInitial.details.carbohydrates *quantity) ,
                    fat: Math.round(foodInitial.details.fat * quantity),
                    fiber: Math.round(foodInitial.details.fiber * quantity) ,
                    calories: Math.round(foodInitial.details.calories * quantity)     
            }

                 
            const updatedFood: FoodProps["food"] = {
                ...foodInitial,
                details: updatedDetails,
              };
              
            console.log("Converted Quantity:", convertedQuantity);
            console.log("Food Initial:", foodInitial);
            console.log("updatedFood", updatedFood);

            setFoodData(updatedFood);
        } else {
            setEatenQuantity(0);
            setFoodData(foodInitial);
        }
    }

    function handleWhenChange(event: React.ChangeEvent<HTMLSelectElement>) {
        setSelectedWhen(event.target.value);
    }

    function trackFoodItem() {
     
        
        let trackedItem = {
            userId: localStorage.user,
            foodName: foodData.foodName,
            eatenWhen: selectedWhen,
            servingUnit: foodData.serving_unit,
            details: { 
                calories: Math.round(foodData.details.calories), // Use updated macros
                protein: Math.round(foodData.details.protein),
                carbohydrates: Math.round(foodData.details.carbohydrates),
                fat: Math.round(foodData.details.fat),
                fiber: Math.round(foodData.details.fiber)
            }, 
            quantity: eatenQuantity
        };

        fetch("api/track", {
            method: "POST",
            body: JSON.stringify(trackedItem),
            headers: {
                "Authorization": `Bearer ${localStorage.token}`,
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                // Redirect to the MealsConsumedPage upon successful submission
                navigate('/mealsConsumed');  
              })
            .catch((err) => console.log(err));
        
    }

    return (
        <Box p={5} bg="gray.800" color="white" borderRadius="md" boxShadow="lg">
            <Heading size="md" color="white" textAlign="center">{foodData.foodName.charAt(0).toUpperCase() + foodData.foodName.slice(1)} ({Math.round(foodData.details.calories)} Kcal)</Heading>
             {/* Protein, Carbs in one row and Fat, Fiber in another using Grid */}
    <Grid templateColumns="repeat(2, 1fr)" gap={4} mt={10}>
        <Text textAlign="center">Protein: {Math.round(foodData.details.protein)}g</Text>
        <Text textAlign="center">Carbs: {Math.round(foodData.details.carbohydrates)}g</Text>
    </Grid>

    <Grid templateColumns="repeat(2, 1fr)" gap={4} mt={2}>
        <Text textAlign="center">Fat: {Math.round(foodData.details.fat)}g</Text>
        <Text textAlign="center">Fiber: {Math.round(foodData.details.fiber)}g</Text>
    </Grid>
    <Box mt={10} />
            <HStack align="center" justify="center" spacing={4} mt={2}>
            <Input type="number" placeholder="Quantity" onChange={calculateMacros} bg="white" color="black" size="sm" width="80px" flexShrink={0} />
            <Text bg="white" color="black" size="sm" flexGrow={1}>{foodData.serving_unit || "N/A"}</Text>
            </HStack>
            <HStack spacing={3} mt={4}>
                <Text>When:</Text>
                <Select onChange={handleWhenChange} value={selectedWhen} bg="white" color="black" size="sm">
                    <option value="breakfast">Breakfast</option>
                    <option value="AM snack">AM Snack</option>
                    <option value="lunch">Lunch</option>
                    <option value="PM snack">PM Snack</option>
                    <option value="dinner">Dinner</option>
                </Select>
            </HStack>
            <Box display="flex" justifyContent="center" alignItems="center" height="10vh">
                <Button mt={4} colorScheme="green" onClick={trackFoodItem}>Track</Button>
            </Box>        
        </Box>
    );
};

export default FoodItem;
