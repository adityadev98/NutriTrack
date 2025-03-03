import React, { useState } from "react";
import { searchFoodAPI, fetchFoodDetailsAPI } from "../Services/nutritionixAPI";
import { Input, Box, Text, Image, VStack } from "@chakra-ui/react";
import '../App.css';

interface TrackSearchProps {
  setSelectedFood: (food: any) => void;
}
interface FoodItem {
  food_name: string;
  photo: { thumb: string };
}

const TrackSearch: React.FC<TrackSearchProps> = ({ setSelectedFood }) => {
  const [query, setQuery] = useState("");
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);

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
  <Box className="search" p={4}>
      <Input
        className="search-inp"
        onChange={searchFood}
        type="search"
        placeholder="Search Food Item"
        value={query}
        size="lg"
        mb={4}
      />

      {foodItems.length > 0 && (
        <VStack align="stretch" spacing={3}>
          {foodItems.map((item, index) => (
            <Box
              key={index}
              onClick={() => fetchFoodDetails(item.food_name)}
              display="flex"
              alignItems="center"
              cursor="pointer"
              p={2}
              border="1px"
              borderColor="gray.200"
              borderRadius="md"
              _hover={{ bg: "gray.100" }}
            >
              <Image
                src={item.photo.thumb}
                alt={item.food_name}
                boxSize="40px"
                objectFit="cover"
                mr={3}
              />
              <Text>{item.food_name}</Text>
            </Box>
          ))}
        </VStack>
      )}
    </Box>
);
};

export default TrackSearch;
