import React from "react";

type FoodItem = {
  food_name: string;
  photo: { thumb: string };
};

type SearchResultsProps = {
  foodItems: FoodItem[];
  onSelect: (foodName: string) => void;
};

const SearchResults: React.FC<SearchResultsProps> = ({ foodItems, onSelect }) => {
  if (foodItems.length === 0) return null;

  return (
    <div className="search-results">
      {foodItems.map((item, index) => (
        <p
          className="item"
          onClick={() => onSelect(item.food_name)}
          key={index}
        >
          <img src={item.photo.thumb} alt={item.food_name} className="food-image" />
          <span className="item-text">{item.food_name}</span>
        </p>
      ))}
    </div>
  );
};

export default SearchResults;
