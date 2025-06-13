import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {  Button, Box, Container, Heading, Text, Spinner, VStack,SimpleGrid, HStack} from '@chakra-ui/react';
import { Stat,StatLabel, StatNumber} from "@chakra-ui/stat"
import {Sidenav} from "../../Components/Sections";

interface FoodDetails {
  foodName: string;
  eatenWhen: string; // Added to categorize meals
  details: {
    calories: number;
    protein: number;
    carbohydrates: number;
    fat: number;
    fiber: number;
  };
}

const MealsConsumedPage = () => {
  const navigate = useNavigate();
  const [meals, setMeals] = useState<FoodDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);


  // Fetch today's food tracking data using fetch
  useEffect(() => {

    const fetchMeals = async () => {
      try {
        const response = await fetch('/api/mealsConsumed', {
          method: 'GET',
          headers: {
            "Authorization": `Bearer ${localStorage.token}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error('Error fetching meals data');
        }
        const data = await response.json();
        setMeals(data.data);
        setLoading(false);
      } catch (err) {
        setError('No meals tracked today');
        setLoading(false);
      }
    };
   
    fetchMeals();
    
  }, []);


  // Function to categorize meals based on 'eatenWhen'
  const categorizeMeals = (meals: FoodDetails[]) => {
    const categorizedMeals: Record<string, FoodDetails[]> = {
      breakfast: [],
      "AM snack": [],
      lunch: [],
      "PM snack": [],
      dinner: [],
    };

    meals.forEach((meal) => {
      if (meal.eatenWhen && categorizedMeals[meal.eatenWhen]) {
        categorizedMeals[meal.eatenWhen].push(meal);
      }
    });

    return categorizedMeals;
  };

  // Categorize meals
  const categorizedMeals = categorizeMeals(meals);

  // Calculate the totals of all the nutrients
  const calculateTotalNutrients = (meals: FoodDetails[]) => {
    return meals.reduce(
      (totals, meal) => {
        totals.calories += meal.details.calories;
        totals.protein += meal.details.protein;
        totals.carbohydrates += meal.details.carbohydrates;
        totals.fat += meal.details.fat;
        totals.fiber += meal.details.fiber;
        return totals;
      },
      { calories: 0, protein: 0, carbohydrates: 0, fat: 0, fiber: 0 }
    );
  };

  const totalNutrients = calculateTotalNutrients(meals);

  // Render loading state, error message, or the actual meal data
  if (loading) {
    return (
      <Sidenav>
      <Container centerContent>
        <Spinner size="xl" />
        <Text mt={4}>Loading meals...</Text>
      </Container>
      </Sidenav>
    );
  }
return (
    <Sidenav>
      <Box bg="white" boxShadow="md" borderRadius="lg" p={0} mb={10}>
        <Box bg="var(--dark-green)" borderTopRadius="lg" px={6} py={4}>
          <Heading size="lg" color="white">Meals Consumed Today</Heading>
        </Box>
        <Box p={6} borderBottomRadius="lg" color="var(--dark-green)">
          <Text fontSize="md" fontWeight="medium">
            Review all meals you've consumed today. Check total calories, proteins, carbs, and fats to stay on track with your goals.
          </Text>
        </Box>
      </Box>
    <Box bg="white" boxShadow="md" borderRadius="lg" p={6}>
    <Container maxW="container.lg" py={6}>
     <HStack justifyContent="space-between" mb={6}>
        <Heading as="h1" size="xl">Tracked Meals</Heading>
        <HStack>
          <Button mt={4} data-testid="Search-Food" colorScheme="blue" onClick={() => navigate('/track')}>Search Food</Button>
          <Button mt={4} data-testid="Add-Your-Own-Meal" colorScheme="green" onClick={() => navigate('/customFood')}>Add Your Own Meal</Button>
        </HStack>
      </HStack>
      
      {error && (
        <Container centerContent>
          <Text color="red.500">{error}</Text>
        </Container>
      )}


      {/* Loop through the categories and render them */}
      {Object.keys(categorizedMeals).map((mealTime) => (
        categorizedMeals[mealTime as keyof typeof categorizedMeals].length > 0 && (
          <Box key={mealTime} mb={8}>
            <Heading size="lg" mb={4}>
              {mealTime.charAt(0).toUpperCase() + mealTime.slice(1)}
            </Heading>
            {/* Custom Divider using Box */}
            <Box width="100%" height="1px" bg="gray.300" my={4} />
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {categorizedMeals[mealTime as keyof typeof categorizedMeals].map((meal, index) => (
                <Box key={index} p={5} shadow="md" borderWidth="1px" borderRadius="md">
                  <VStack align="start" spacing={3}>
                    <Heading size="md">{meal.foodName.charAt(0).toUpperCase() + meal.foodName.slice(1)}</Heading>
                    <Text fontWeight="bold">Calories: {meal.details.calories}</Text>
                    <Text>Protein: {meal.details.protein}g</Text>
                    <Text>Carbohydrates: {meal.details.carbohydrates}g</Text>
                    <Text>Fat: {meal.details.fat}g</Text>
                    <Text>Fiber: {meal.details.fiber}g</Text>
                  </VStack>
                </Box>
              ))}
            </SimpleGrid>
          </Box>
        )
      ))}
      {/* Display the totals */}
      <Box mt={8}>
  <Heading size="lg" mb={4}>Total Nutrients</Heading>

  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
    {/* Total Calories */}
    <Stat p={4} boxShadow="md" borderRadius="md">
      <StatLabel>Total Calories</StatLabel>
      <StatNumber>{totalNutrients.calories}</StatNumber>
    </Stat>

    {/* Total Protein */}
    <Stat p={4} boxShadow="md" borderRadius="md">
      <StatLabel>Total Protein</StatLabel>
      <StatNumber>{totalNutrients.protein}g</StatNumber>
    </Stat>

    {/* Total Carbohydrates */}
    <Stat p={4} boxShadow="md" borderRadius="md">
      <StatLabel>Total Carbohydrates</StatLabel>
      <StatNumber>{totalNutrients.carbohydrates}g</StatNumber>
    </Stat>

    {/* Total Fat */}
    <Stat p={4} boxShadow="md" borderRadius="md">
      <StatLabel>Total Fat</StatLabel>
      <StatNumber>{totalNutrients.fat}g</StatNumber>
    </Stat>

    {/* Total Fiber */}
    <Stat p={4} boxShadow="md" borderRadius="md">
      <StatLabel>Total Fiber</StatLabel>
      <StatNumber>{totalNutrients.fiber}g</StatNumber>
    </Stat>
  </SimpleGrid>
</Box>
    </Container>
  </Box>
  </Sidenav>
  );
};

export default MealsConsumedPage;
