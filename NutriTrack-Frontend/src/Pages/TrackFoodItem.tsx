import { useEffect, useState, useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { useNavigate } from 'react-router-dom';
import { Grid, Box, Button, Input, Select, Text, HStack, Heading } from "@chakra-ui/react";
import '../App.css';

interface Measure {
    serving_weight: number;
    measure: string;
    seq?: number | null;
    qty: number;
}

interface FoodProps {
    food: {
        name: string;
        calories: number;
        protein: number;
        carbohydrates: number;
        fat: number;
        fiber: number;
        serving_weight_grams: number;
        alt_measures: Measure[];
        serving_unit : string;
        _id?: string;
    };
}

const FoodItem: React.FC<FoodProps> = ({ food }) => {
    const navigate = useNavigate();
    const [eatenQuantity, setEatenQuantity] = useState<number>(food.serving_weight_grams);
    const [foodData, setFoodData] = useState<FoodProps["food"]>(food);
    const [foodInitial, setFoodInitial] = useState<FoodProps["food"]>(food);
    const [selectedUnit, setSelectedUnit] = useState<string>("grams");
    const [unitOptions, setUnitOptions] = useState<Measure[]>([]);
    const [selectedWhen, setSelectedWhen] = useState<string>("breakfast");
    const loggedData = useContext(UserContext);
  
    useEffect(() => {
        setFoodData(food);
        setFoodInitial(food);
        
        if (food.alt_measures) {
            setUnitOptions(food.alt_measures);
        }
    }, [food]);

   
    function calculateMacros(event: React.ChangeEvent<HTMLInputElement>) {
        let quantity = Number(event.target.value);
        if (quantity > 0) {
            const selectedMeasure = unitOptions.find((unit) => unit.measure === selectedUnit);
            const servingWeight = selectedMeasure ? selectedMeasure.serving_weight : food.serving_weight_grams;
            const convertedQuantity = (servingWeight * quantity) / food.serving_weight_grams;
            
            console.log("selectedMeasure:", selectedMeasure);
            console.log("selectedUnit", selectedUnit);
            console.log("servingWeight:", servingWeight);
            console.log("convertedQuantity:", convertedQuantity);
            console.log("food.serving_weight_grams:", food.serving_weight_grams);

            setEatenQuantity(quantity);

            let updatedFood = { ...foodInitial };
            updatedFood.protein = Math.round(foodInitial.protein * convertedQuantity );
            updatedFood.carbohydrates = Math.round(foodInitial.carbohydrates *convertedQuantity) ;
            updatedFood.fat = Math.round(foodInitial.fat * convertedQuantity) ;
            updatedFood.fiber = Math.round(foodInitial.fiber * convertedQuantity) ;
            updatedFood.calories = Math.round(foodInitial.calories * convertedQuantity);
              
            console.log("Converted Quantity:", convertedQuantity);
            console.log("Food Initial:", foodInitial);

            setFoodData(updatedFood);
        } else {
            setEatenQuantity(0);
            setFoodData(foodInitial);
        }
    }

    function handleUnitChange(event: React.ChangeEvent<HTMLSelectElement>) {
        setSelectedUnit(event.target.value);
    }

    function handleWhenChange(event: React.ChangeEvent<HTMLSelectElement>) {
        setSelectedWhen(event.target.value);
    }

    function trackFoodItem() {
     
        
        let trackedItem = {
            // userId: loggedData.loggedUser.userid,
            userId: "6792c2bbe61a8b6ed753af2c",
            foodName: foodData.name,
            eatenWhen: selectedWhen,
            servingUnit: selectedUnit,
            details: { 
                calories: Math.round(foodData.calories), // Use updated macros
                protein: Math.round(foodData.protein),
                carbohydrates: Math.round(foodData.carbohydrates),
                fat: Math.round(foodData.fat),
                fiber: Math.round(foodData.fiber)
            }, 
            quantity: eatenQuantity
        };

        fetch("/api/track", {
            method: "POST",
            body: JSON.stringify(trackedItem),
            headers: {
                // "Authorization": `Bearer ${loggedData.loggedUser.token}`,
                "Content-Type": "application/json"
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
            <Heading size="md" color="white" textAlign="center">{foodData.name.charAt(0).toUpperCase() + foodData.name.slice(1)} ({Math.round(foodData.calories)} Kcal)</Heading>
             {/* Protein, Carbs in one row and Fat, Fiber in another using Grid */}
    <Grid templateColumns="repeat(2, 1fr)" gap={4} mt={10}>
        <Text textAlign="center">Protein: {Math.round(foodData.protein)}g</Text>
        <Text textAlign="center">Carbs: {Math.round(foodData.carbohydrates)}g</Text>
    </Grid>

    <Grid templateColumns="repeat(2, 1fr)" gap={4} mt={2}>
        <Text textAlign="center">Fat: {Math.round(foodData.fat)}g</Text>
        <Text textAlign="center">Fiber: {Math.round(foodData.fiber)}g</Text>
    </Grid>
    <Box mt={10} />
            <HStack align="center" justify="center" spacing={4} mt={2}>
            <Input type="number" placeholder="Quantity" onChange={calculateMacros} bg="white" color="black" size="sm" width="80px" flexShrink={0} />
      <Select onChange={handleUnitChange} value={selectedUnit} bg="white" color="black" size="sm" flexGrow={1}>
                    {unitOptions.length > 0 ? (
                        unitOptions.map((unit, index) => (
                            <option key={index} value={unit.measure}>{unit.measure}</option>
                        ))
                    ) : (
                        <option value="g">grams</option>
                    )}
                </Select>
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
