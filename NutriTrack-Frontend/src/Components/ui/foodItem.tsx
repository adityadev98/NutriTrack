import { useEffect, useState } from "react";
import MacroDetails from "./macrosDetails";
import TrackControl from "./trackControl";
import { UserContext } from "../../contexts/UserContext";
import { useContext } from "react";

interface FoodProps {
    food: {
        name: string;
        calories: number;
        protein: number;
        carbohydrates: number;
        fat: number;
        fiber: number;
        _id?: string;
    };
}

const FoodItem: React.FC<FoodProps> = ({ food }) => {
    const [eatenQuantity, setEatenQuantity] = useState<number>(100);
    const [foodData, setFoodData] = useState<FoodProps["food"]>(food);
    const [foodInitial, setFoodInitial] = useState<FoodProps["food"]>(food);
    const loggedData = useContext(UserContext);

    useEffect(() => {
        setFoodData(food);
        setFoodInitial(food);
    }, [food]);

    return (
        <div className="food">
            <h2>{foodData.name} ({foodData.calories} Kcal for {eatenQuantity}g)</h2>
            <MacroDetails food={foodData} />
            <TrackControl
                food={foodData}
                foodInitial={foodInitial}
                eatenQuantity={eatenQuantity}
                setEatenQuantity={setEatenQuantity}
            />
        </div>
    );
};

export default FoodItem;
