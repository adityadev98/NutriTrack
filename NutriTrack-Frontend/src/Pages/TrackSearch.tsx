import React, { useState } from "react";
import { searchFoodAPI, fetchFoodDetailsAPI } from "../Services/nutritionixAPI";

interface TrackSearchProps {
  setSelectedFood: (food: any) => void;
}

const TrackSearch: React.FC<TrackSearchProps> = ({ setSelectedFood }) => {
  const [query, setQuery] = useState("");
  const [foodItems, setFoodItems] = useState([]);

  const searchFood = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;
    setQuery(input);
    
    if (!input.length) {
      setFoodItems([]);
      return;
    }

    const results = await searchFoodAPI(input);
    setFoodItems(results);
  };

  const fetchFoodDetails = async (foodName: string) => {
    const food = await fetchFoodDetailsAPI(foodName);
    if (food) {
      setSelectedFood({
        name: food.food_name,
        calories: food.nf_calories,
        protein: food.nf_protein,
        carbohydrates: food.nf_total_carbohydrate,
        fiber: food.nf_dietary_fiber,
        fat: food.nf_total_fat,
        image: food.photo.thumb,
        alt_measures: food.alt_measures,
        serving_weight_grams: food.serving_weight_grams,
        serving_unit: food.serving_unit
      });
      setFoodItems([]);
    }
  };

  return (
    <div className="search">
      <input
        className="search-inp"
        onChange={searchFood}
        type="search"
        placeholder="Search Food Item"
        value={query}
      />

      {foodItems.length > 0 && (
        <div className="search-results">
          {foodItems.map((item, index) => (
            <p className="item" onClick={() => fetchFoodDetails(item.food_name)} key={index}>
              <img src={item.photo.thumb} alt={item.food_name} className="food-image" />
              <span className="item-text">{item.food_name}</span>
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrackSearch;
