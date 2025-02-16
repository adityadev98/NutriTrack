import { useEffect, useState, useContext } from "react";
import { UserContext } from "../contexts/UserContext";

interface FoodProps {
    food: {
        name: string;
        calories: number;
        protein: number;
        carbohydrates: number;
        fat: number;
        fiber: number;
        serving_weight_grams: number;
        alt_measures: any;
        serving_unit : string;
        _id?: string;
    };
}

const FoodItem: React.FC<FoodProps> = ({ food }) => {
 
    const [eatenQuantity, setEatenQuantity] = useState<number>(100);
    const [foodData, setFoodData] = useState<FoodProps["food"]>(food);
    const [foodInitial, setFoodInitial] = useState<FoodProps["food"]>(food);
    const [selectedUnit, setSelectedUnit] = useState<string>("grams");
    const [unitOptions, setUnitOptions] = useState<Measure[]>([]);
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
            setEatenQuantity(quantity);

            let updatedFood = { ...foodInitial };
            updatedFood.protein = Math.round((foodInitial.protein * quantity) / 100);
            updatedFood.carbohydrates = Math.round((foodInitial.carbohydrates * quantity) / 100);
            updatedFood.fat = Math.round((foodInitial.fat * quantity) / 100);
            updatedFood.fiber = Math.round((foodInitial.fiber * quantity) / 100);
            updatedFood.calories = Math.round((foodInitial.calories * quantity) / 100);
            
            
            setFoodData(updatedFood);
        } else {
            setEatenQuantity(0);
            setFoodData(foodInitial); // Reset macros if input is empty
        }

    }
    function handleUnitChange(event: React.ChangeEvent<HTMLSelectElement>) {
        setSelectedUnit(event.target.value);
    }

    function trackFoodItem() {
        let trackedItem = {
            userId: loggedData.loggedUser.userid,
            foodId: food._id,
            details: { ...foodData }, // Use updated macros
            quantity: eatenQuantity,
        };

        fetch("http://localhost:8001/track", {
            method: "POST",
            body: JSON.stringify(trackedItem),
            headers: {
                "Authorization": `Bearer ${loggedData.loggedUser.token}`,
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((data) => console.log(data))
            .catch((err) => console.log(err));
    }

    return (
        <div className="food">
            <h2>{foodData.name} ({foodData.calories} Kcal for {foodData.serving_weight_grams} {foodData.serving_unit})</h2>

            <>
            <div className="nutrient">
                <p className="n-title">Protein</p>
                <p className="n-value">{foodData.protein}g</p>
            </div>
            <div className="nutrient">
                <p className="n-title">Carbs</p>
                <p className="n-value">{foodData.carbohydrates}g</p>
            </div>
            <div className="nutrient">
                <p className="n-title">Fat</p>
                <p className="n-value">{foodData.fat}g</p>
            </div>
            <div className="nutrient">
                <p className="n-title">Fibre</p>
                <p className="n-value">{foodData.fiber}g</p>
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
                            <option value="grams">grams</option>
                        )}
                    </select>
                   
                    
                </div>

                <button className="btn" onClick={trackFoodItem}>Track</button>
            </div>

        </div>
    );
};

export default FoodItem;
