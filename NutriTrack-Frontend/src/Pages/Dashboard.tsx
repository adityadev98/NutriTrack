import React, { useEffect, useState } from 'react';
import { Container, VStack, Heading, Text, Box, Stat, StatLabel, StatNumber, StatGroup, Button, Spinner} from "@chakra-ui/react";
import {Sidenav} from "../Components/Sections";
import { useNavigate } from 'react-router-dom';
import axiosInstance from "../utils/axiosInstance";
//import '../style.css';

     
const Dashboard: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
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
    return <Spinner
      thickness='4px'
      speed='0.65s'
      emptyColor='gray.200'
      color='blue.500'
      size='xl'
    />;
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

  const bmr = calculateBMR(profile.weight, profile.height, profile.age, profile.gender);
  const tdee = calculateTDEE(bmr, profile.activityLevel);
  const proteinNeeds = calculateProteinNeeds(profile.weight);



  

  return (
    <Sidenav> 
    <Container maxW="container.lg" py={6}>
      <VStack gap={4} align="center">
        <Heading color="var(--dark-green)">Dashboard</Heading>
        <Box p={5} shadow="md" borderWidth="1px" borderRadius="md" bg="var(--soft-white)" width="100%">
          <StatGroup>
            <Stat>
              <StatLabel>Name</StatLabel>
              <StatNumber>{profile.name}</StatNumber>
            </Stat>
            <Stat>
              <StatLabel>Age</StatLabel>
              <StatNumber>{profile.age}</StatNumber>
            </Stat>
            <Stat>
              <StatLabel>Gender</StatLabel>
              <StatNumber>{profile.gender}</StatNumber>
            </Stat>
            <Stat>
              <StatLabel>Activity Level</StatLabel>
              <StatNumber>{profile.activityLevel}</StatNumber>
            </Stat>
            <Stat>
              <StatLabel>Height</StatLabel>
              <StatNumber>{profile.height} cm</StatNumber>
            </Stat>
            <Stat>
              <StatLabel>Weight</StatLabel>
              <StatNumber>{profile.weight} kg</StatNumber>
            </Stat>
            <Stat>
              <StatLabel>Daily Calorie Needs</StatLabel>
              <StatNumber>{Math.round(tdee)} kcal</StatNumber>
            </Stat>
            <Stat>
              <StatLabel>Daily Protein Needs</StatLabel>
              <StatNumber>{Math.round(proteinNeeds)} g</StatNumber>
            </Stat>
          </StatGroup>
          <Button
            mt={4}
            colorScheme="green"
            onClick={() => navigate('/profile-setup', { state: { profile } })}
          >
            Edit Profile
          </Button>
        </Box>
      </VStack>
    </Container>
    </Sidenav>
  );
};

export default Dashboard;