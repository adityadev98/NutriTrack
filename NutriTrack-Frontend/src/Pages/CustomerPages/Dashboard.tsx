import React, { useEffect, useState } from 'react';
import { Container, VStack, Heading, Box, Stat, StatLabel, StatNumber, StatGroup, Button, Spinner, Progress, Text, HStack, SimpleGrid } from "@chakra-ui/react";
import { Sidenav } from "../../Components/Sections";
import { useNavigate } from 'react-router-dom';
import axiosInstance from "../../utils/axiosInstance";

const Dashboard: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [waterIntake, setWaterIntake] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axiosInstance.get('/api/user/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(response.data.userProfile);
      } catch (error) {
        console.error('Error fetching profile', error);
      }
    };

    fetchProfile();
  }, []);

  if (!profile) {
    return <Spinner thickness='4px' speed='0.65s' emptyColor='gray.200' color='blue.500' size='xl' />;
  }

  // Calculate BMR using the Harris-Benedict equation
  const calculateBMR = (weight: number, height: number, age: number, gender: string) => {
    if (gender === 'male') {
      return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
      return 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }
  };

  // Adjust BMR based on activity level to get TDEE
  const calculateTDEE = (bmr: number, activityLevel: string) => {
    switch (activityLevel) {
      case 'light':
        return bmr * 1.375;
      case 'moderate':
        return bmr * 1.55;
      case 'active':
        return bmr * 1.725;
      case 'very active':
        return bmr * 1.9;
      default:
        return bmr;
    }
  };

  // Estimate daily protein needs (grams per kilogram of body weight)
  const calculateProteinNeeds = (weight: number) => {
    return weight * 1.6; // 1.6 grams of protein per kilogram of body weight
  };

  // Calculate BMI
  const calculateBMI = (weight: number, height: number) => {
    const heightInMeters = height / 100; // Convert height to meters
    return weight / (heightInMeters * heightInMeters);
  };

  // Calculate hydration needs (mL per day)
  const calculateHydrationNeeds = (weight: number, activityLevel: string) => {
    let baseWater = weight * 0.033; // 33mL per kg of body weight
    if (activityLevel === 'active' || activityLevel === 'very active') {
      baseWater += 500; // Add 500mL for active people
    }
    return baseWater * 5; // Convert to milliliters
  };

  const bmr = calculateBMR(profile.weight, profile.height, profile.age, profile.gender);
  const tdee = calculateTDEE(bmr, profile.activityLevel);
  const proteinNeeds = calculateProteinNeeds(profile.weight);
  const bmi = calculateBMI(profile.weight, profile.height);
  const hydrationNeeds = calculateHydrationNeeds(profile.weight, profile.activityLevel);
  const waterPercentage = Math.min((waterIntake / hydrationNeeds) * 100, 120); // Cap at 120%

  const getHydrationMessage = () => {
    if (waterPercentage < 30) return "Need to drink more water!";
    if (waterPercentage >= 30 && waterPercentage < 70) return "Progress is going well!";
    if (waterPercentage >= 70 && waterPercentage <= 100) return "You are well hydrated!";
    if (waterPercentage > 100) return "Too much is also bad!";
    return "";
  };

  const handleWaterChange = (amount: number) => {
    setWaterIntake((prev) => Math.max(0, prev + amount)); // Prevent negative intake
  };

  return (
    <Sidenav> 
      <Container maxW="container.lg" py={6}>
        <VStack gap={4} align="center">
          <Heading color="var(--dark-green)">Dashboard</Heading>
          <Box p={5} shadow="md" borderWidth="1px" borderRadius="md" bg="var(--soft-white)" width="100%">
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={5}>
              <Stat>
                <StatLabel fontSize="lg" fontWeight="bold">Name</StatLabel>
                <StatNumber fontSize="md">{profile.name}</StatNumber>
              </Stat>
              <Stat>
                <StatLabel fontSize="lg" fontWeight="bold">Age</StatLabel>
                <StatNumber fontSize="md">{profile.age}</StatNumber>
              </Stat>
              <Stat>
                <StatLabel fontSize="lg" fontWeight="bold">Gender</StatLabel>
                <StatNumber fontSize="md">{profile.gender}</StatNumber>
              </Stat>
              <Stat>
                <StatLabel fontSize="lg" fontWeight="bold">Activity Level</StatLabel>
                <StatNumber fontSize="md">{profile.activityLevel}</StatNumber>
              </Stat>
              <Stat>
                <StatLabel fontSize="lg" fontWeight="bold">Height</StatLabel>
                <StatNumber fontSize="md">{profile.height} cm</StatNumber>
              </Stat>
              <Stat>
                <StatLabel fontSize="lg" fontWeight="bold">Weight</StatLabel>
                <StatNumber fontSize="md">{profile.weight} kg</StatNumber>
              </Stat>
              <Stat>
                <StatLabel fontSize="lg" fontWeight="bold">Daily Calorie Needs</StatLabel>
                <StatNumber fontSize="md">{Math.round(tdee)} kcal</StatNumber>
              </Stat>
              <Stat>
                <StatLabel fontSize="lg" fontWeight="bold">Daily Protein Needs</StatLabel>
                <StatNumber fontSize="md">{Math.round(proteinNeeds)} g</StatNumber>
              </Stat>
              <Stat>
                <StatLabel fontSize="lg" fontWeight="bold">BMI</StatLabel>
                <StatNumber fontSize="md">{bmi.toFixed(2)}</StatNumber>
              </Stat>
            </SimpleGrid>

            {/* Hydration Bar */}
            <Box mt={6}>
              <Heading size="md" mb={2}>Hydration Tracker</Heading>
              <HStack>
                <Button colorScheme="blue" onClick={() => handleWaterChange(-250)}>-</Button>
                <Text fontSize="lg">{(waterIntake / 250)} glasses</Text>
                <Button colorScheme="blue" onClick={() => handleWaterChange(250)}>+</Button>
              </HStack>
              <Progress value={waterPercentage} size="lg" colorScheme="blue" mt={2} />
              <Text mt={2} fontSize="sm" fontWeight="bold">{getHydrationMessage()}</Text>
            </Box>

            {/* Display Daily Water Intake */}
            <Box mt={6}>
              <StatGroup>
                <Stat>
                  <StatLabel>Daily Water Intake</StatLabel>
                  <StatNumber>{Math.round(waterIntake)} mL / {Math.round(hydrationNeeds)} mL</StatNumber>
                </Stat>
              </StatGroup>
            </Box>

            <Button mt={4} colorScheme="green" onClick={() => navigate('/profile-setup', { state: { profile } })}>
              Edit Profile
            </Button>
          </Box>
        </VStack>
      </Container>
    </Sidenav>
  );
};

export default Dashboard;