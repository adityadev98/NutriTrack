import { useEffect, useState, useContext } from "react";
import { UserContext } from "../contexts/UserContext";

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
            eaten_when: selectedWhen,
            servingUnit: selectedUnit,
            details: { ...foodData }, // Use updated macros
            quantity: eatenQuantity
        };

        fetch("http://localhost:8001/track", {
            method: "POST",
            body: JSON.stringify(trackedItem),
            headers: {
                // "Authorization": `Bearer ${loggedData.loggedUser.token}`,
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((data) => console.log(data))
            .catch((err) => console.log(err));
    }

    return (
        <div className="food">
            <h2>{foodData.name} ({Math.round(foodData.calories)} Kcal)</h2>

            <>
            <div className="nutrient">
                <p className="n-title">Protein</p>
                <p className="n-value">{Math.round(foodData.protein)}g</p>
            </div>
            <div className="nutrient">
                <p className="n-title">Carbs</p>
                <p className="n-value">{Math.round(foodData.carbohydrates)}g</p>
            </div>
            <div className="nutrient">
                <p className="n-title">Fat</p>
                <p className="n-value">{Math.round(foodData.fat)}g</p>
            </div>
            <div className="nutrient">
                <p className="n-title">Fibre</p>
                <p className="n-value">{Math.round(foodData.fiber)}g</p>
            </div>
        </>

            {/* Track Control */}
            <div className="track-control">
                <div className="quantity-unit-wrapper">
                <input 
                        type="number" 
                        onChange={calculateMacros} 
                        className="inp quantity-input"  
                        placeholder={`Quantity`} 
                    />

                    <select 
                        onChange={handleUnitChange} 
                        value={selectedUnit} 
                        className="unit-dropdown"
                    >
                        {unitOptions.length > 0 ? (
                            unitOptions.map((unit, index) => (
                                <option key={index} value={unit.measure}>
                                    {unit.measure}
                                </option>
                            ))
                        ) : (
                            <option value="g">grams</option>
                        )}
                    </select>    
                </div>
                <div className="when-dropdown-wrapper">
                    <label htmlFor="when-dropdown">When:</label>
                    <select 
                        id="when-dropdown"
                        onChange={handleWhenChange} 
                        value={selectedWhen} 
                        className="when-dropdown"
                    >
                        <option value="breakfast">Breakfast</option>
                        <option value="AM snack">AM Snack</option>
                        <option value="lunch">Lunch</option>
                        <option value="PM snack">PM Snack</option>
                        <option value="dinner">Dinner</option>
                    </select>
                </div>

                <button className="btn" onClick={trackFoodItem}>Track</button>
            </div>

        </div>
    );
};

export default FoodItem;
