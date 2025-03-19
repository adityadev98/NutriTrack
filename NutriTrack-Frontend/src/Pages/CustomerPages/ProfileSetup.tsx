import React, { useState, useContext, useEffect, FormEvent } from 'react';
import axios from 'axios';
import { useNavigate} from 'react-router-dom';
import { Container, VStack, Input, Button, Heading, Select, FormControl, FormLabel, Spinner } from "@chakra-ui/react";
import { Sidenav } from "../../Components/Sections";
import { UserContext } from "../../contexts/UserContext";

const ProfileSetup: React.FC = () => {
  //const location = useLocation();
  const navigate = useNavigate();
  const userContext = useContext(UserContext);

  // State variables for form fields
  const [name, setName] = useState<string>('');
  const [age, setAge] = useState<number | string>('');
  const [gender, setGender] = useState<string>('');
  const [activityLevel, setActivityLevel] = useState<string>('');
  const [height, setHeight] = useState<number | string>('');
  const [weight, setWeight] = useState<number | string>('');
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch existing profile data on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token") || "";
        const response = await axios.get('/api/user/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const userProfile = response.data.userProfile;

        // Pre-fill form fields with existing profile data
        setName(userProfile.name || '');
        setAge(userProfile.age || '');
        setGender(userProfile.gender || '');
        setActivityLevel(userProfile.activityLevel || '');
        setHeight(userProfile.height || '');
        setWeight(userProfile.weight || '');
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token") || "";
      const data = { name, age, gender, activityLevel, height, weight };

      console.log('Sending data:', data);
      const response = await axios.post('/api/user/profile/setup', data, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('Profile setup response:', response.data);

      // Update localStorage and React Context
      const { userProfile } = response.data;
      const storedUser = JSON.parse(localStorage.getItem("loggedUser") || "{}");

      const updatedUser = {
        userid: storedUser.userid || userProfile.user,
        token,
        name: userProfile.name,
        profileCompleted: userProfile.profileCompleted,
        userType: storedUser.userType,
        verified: storedUser.verified,
        tokenExpiry: storedUser.tokenExpiry,
      };

      localStorage.setItem("loggedUser", JSON.stringify(updatedUser));

      if (userContext && userContext.setLoggedUser) {
        userContext.setLoggedUser(updatedUser);
      }

      navigate("/dashboard");
    } catch (error) {
      console.error('Error updating profile:', error);
      navigate('/dashboard');
    }
  };

  if (loading) {
    return (
      <Sidenav>
        <Container>
          <Spinner size="xl" />
        </Container>
      </Sidenav>
    );
  }

  return (
    <Sidenav>
      <Container>
        <VStack gap={4} align="center">
          <Heading>Profile Setup</Heading>
          <form onSubmit={handleSubmit}>
            <FormControl id="name" isRequired>
              <FormLabel>Name</FormLabel>
              <Input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            </FormControl>
            <FormControl id="age" isRequired>
              <FormLabel>Age (years)</FormLabel>
              <Input type="number" value={age} onChange={(e) => setAge(Number(e.target.value))} />
            </FormControl>
            <FormControl id="gender" isRequired>
              <FormLabel>Gender</FormLabel>
              <Select value={gender} onChange={(e) => setGender(e.target.value)}>
                <option value=""></option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </Select>
            </FormControl>
            <FormControl id="activityLevel" isRequired>
              <FormLabel>Activity Level</FormLabel>
              <Select value={activityLevel} onChange={(e) => setActivityLevel(e.target.value)}>
                <option value=""></option>
                <option value="light">Light</option>
                <option value="moderate">Moderate</option>
                <option value="active">Active</option>
                <option value="very active">Very Active</option>
              </Select>
            </FormControl>
            <FormControl id="height" isRequired>
              <FormLabel>Height (cm)</FormLabel>
              <Input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} />
            </FormControl>
            <FormControl id="weight" isRequired>
              <FormLabel>Weight (kg)</FormLabel>
              <Input type="number" value={weight} onChange={(e) => setWeight(Number(e.target.value))} />
            </FormControl>
            <Button type="submit" colorScheme="teal" size="lg" mt={4}>
              Save
            </Button>
          </form>
        </VStack>
      </Container>
    </Sidenav>
  );
};

export default ProfileSetup;