import { useContext } from "react";
import { UserContext } from "../../contexts/UserContext";

interface TrackControlProps {
    food: {
        protein: number;
        carbohydrates: number;
        fat: number;
        fiber: number;
        calories: number;
        _id?: string;
    };
    foodInitial: any;
    eatenQuantity: number;
    setEatenQuantity: (quantity: number) => void;
}

const TrackControl: React.FC<TrackControlProps> = ({ food, foodInitial, eatenQuantity, setEatenQuantity }) => {
    const loggedData = useContext(UserContext);

    function calculateMacros(event: React.ChangeEvent<HTMLInputElement>) {
        if (event.target.value.length !== 0) {
            let quantity = Number(event.target.value);
            setEatenQuantity(quantity);

            let copyFood = { ...food };
            copyFood.protein = (foodInitial.protein * quantity) / 100;
            copyFood.carbohydrates = (foodInitial.carbohydrates * quantity) / 100;
            copyFood.fat = (foodInitial.fat * quantity) / 100;
            copyFood.fiber = (foodInitial.fiber * quantity) / 100;
            copyFood.calories = (foodInitial.calories * quantity) / 100;

            setEatenQuantity(quantity);
        }
    }

    function trackFoodItem() {
        let trackedItem = {
            userId: loggedData.loggedUser.userid,
            foodId: food._id,
            details: {
                protein: food.protein,
                carbohydrates: food.carbohydrates,
                fat: food.fat,
                fiber: food.fiber,
                calories: food.calories,
            },
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
        <div className="track-control">
            <input type="number" onChange={calculateMacros} className="inp" placeholder="Quantity in g" />
            <button className="btn" onClick={trackFoodItem}>Track</button>
        </div>
    );
};

export default TrackControl;
