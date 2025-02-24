import { useState } from "react";
import { Box, Button, Input, Select, VStack, Text } from "@chakra-ui/react";

interface FoodItem {
  id: string;
  name: string;
  quantity: number;
  servingUnit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

const TrackPage = () => {
  const [basket, setBasket] = useState<FoodItem[]>([]);
  const [mealType, setMealType] = useState("breakfast");

  const handleQuantityChange = (id: string, quantity: number) => {
    setBasket((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const handleTrack = () => {
    console.log("Tracked Foods:", basket);
    // Here, you would send data to the backend
  };

  return (
    <Box p={4}>
      <Text fontSize="xl" fontWeight="bold">Basket</Text>
      <VStack spacing={4} align="stretch">
        {basket.length > 0 ? (
          basket.map((item) => (
            <Box key={item.id} p={4} borderWidth={1} borderRadius="md">
              <Text fontWeight="bold">{item.name}</Text>
              <Input
                type="number"
                value={item.quantity}
                onChange={(e) => handleQuantityChange(item.id, Number(e.target.value))}
              />
              <Text>Calories: {item.calories * item.quantity}</Text>
              <Text>Protein: {item.protein * item.quantity}g</Text>
              <Text>Carbs: {item.carbs * item.quantity}g</Text>
              <Text>Fat: {item.fat * item.quantity}g</Text>
              <Text>Fiber: {item.fiber * item.quantity}g</Text>
            </Box>
          ))
        ) : (
          <Text>No items in basket</Text>
        )}
        <Select value={mealType} onChange={(e) => setMealType(e.target.value)}>
          <option value="breakfast">Breakfast</option>
          <option value="lunch">Lunch</option>
          <option value="dinner">Dinner</option>
        </Select>
        <Button colorScheme="blue" onClick={handleTrack}>Track</Button>
      </VStack>
    </Box>
  );
};

export default TrackPage;
