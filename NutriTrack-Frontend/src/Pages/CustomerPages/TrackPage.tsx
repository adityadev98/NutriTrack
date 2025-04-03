import React, { useState} from "react";
import TrackSearch from "@/Pages/CustomerPages/TrackSearch";
import FoodItem from "@/Pages/CustomerPages/TrackFoodItem";
import {Sidenav} from "../../Components/Sections";
import { Box, Heading, Text } from '@chakra-ui/react';
// import '../App.css';

const TrackPage: React.FC = () => {
  const [selectedFood, setSelectedFood] = useState(null);
  return (
    <Sidenav>
    <Box bg="white" boxShadow="md" borderRadius="lg" p={0} mb={10}>
      <Box bg="var(--dark-green)" borderTopRadius="lg" px={6} py={4}>
        <Heading size="lg" color="white">Track Today's Meals</Heading>
      </Box>
      <Box p={6} borderBottomRadius="lg" color="var(--dark-green)">
        <Text fontSize="md" fontWeight="medium">
          Search for food items you've eaten today and log them to track your nutritional intake throughout the day.
        </Text>
      </Box>
    </Box>
    <Box bg="white" boxShadow="md" borderRadius="lg" p={6}>
      <section className="container track-container">
        <TrackSearch setSelectedFood={setSelectedFood} />
        {selectedFood && <FoodItem food={selectedFood} />}
      </section>
    </Box>
    </Sidenav>
  );
};

export default TrackPage;
