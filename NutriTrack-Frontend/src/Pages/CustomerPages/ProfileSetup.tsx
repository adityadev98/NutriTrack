// import React, { useState, useContext, FormEvent } from 'react';
// // import axios from 'axios';
// import axiosInstance from "../../utils/axiosInstance.ts"; 
// import { useNavigate, useLocation } from 'react-router-dom';
// import { Container, VStack, Input, Button, Heading, Select, FormControl, FormLabel, FormErrorMessage, Text } from "@chakra-ui/react";
// import { Sidenav } from "../../Components/Sections";
// import { UserContext } from "../../contexts/UserContext";

// const ProfileSetup: React.FC = () => {
//   const location = useLocation();
//   const profile = location.state?.profile || {};
//   const [name, setName] = useState<string>(profile.name || '');
//   const [age, setAge] = useState<number | string>(profile.age || '');
//   const [gender, setGender] = useState<string>(profile.gender || '');
//   const [activityLevel, setActivityLevel] = useState<string>(profile.activityLevel || '');
//   const [height, setHeight] = useState<number | string>(profile.height || '');
//   const [weight, setWeight] = useState<number | string>(profile.weight || '');
//   const [errors, setErrors] = useState<{ [key: string]: string }>({});
//   const navigate = useNavigate();
//   const userContext = useContext(UserContext);

//   const validate = () => {
//     const newErrors: { [key: string]: string } = {};
//     if (!name) newErrors.name = "Name is required";
//     if (!age || Number(age) <= 0) newErrors.age = "Age must be a positive number";
//     if (!gender) newErrors.gender = "Gender is required";
//     if (!activityLevel) newErrors.activityLevel = "Activity Level is required";
//     if (!height || Number(height) <= 0) newErrors.height = "Height must be greater than 0";
//     if (!weight || Number(weight) <= 0) newErrors.weight = "Weight must be a positive number";
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (!validate()) return;

//     try {
//       const token = localStorage.getItem("token") || "";
//       const data = { name, age, gender, activityLevel, height, weight };

//       const response = await axiosInstance.post('/api/user/profile/setup', data, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       const { userProfile } = response.data;
//       const storedUser = JSON.parse(localStorage.getItem("loggedUser") || "{}");

//       const updatedUser = {
//         userid: storedUser.userid || userProfile.user,
//         token,
//         name: userProfile.name,
//         profileCompleted: userProfile.profileCompleted,
//         userType: storedUser.userType,
//         verified: storedUser.verified,
//         tokenExpiry: storedUser.tokenExpiry,
//       };

//       localStorage.setItem("loggedUser", JSON.stringify(updatedUser));

//       if (userContext && userContext.setLoggedUser) {
//         userContext.setLoggedUser(updatedUser);
//       }

//       navigate("/dashboard");
//     } catch (error) {
//       console.error('Error updating profile', error);
//       navigate('/dashboard');
//     }
//   };

//   return (
//     <Sidenav>
//       <Container>
//         <VStack gap={4} align="center">
//           <Heading>Profile Setup</Heading>
//           <form onSubmit={handleSubmit}>
//             {Object.values(errors).map((err, index) => (
//               <Text key={index} color="red.500">{err}</Text>
//             ))}
//             <FormControl id="name" isRequired isInvalid={!!errors.name}>
//               <FormLabel>Name</FormLabel>
//               <Input type="text" value={name} onChange={(e) => setName(e.target.value)} />
//               <FormErrorMessage>{errors.name}</FormErrorMessage>
//             </FormControl>
//             <FormControl id="age" isRequired isInvalid={!!errors.age}>
//               <FormLabel>Age (years)</FormLabel>
//               <Input type="number" value={age} onChange={(e) => setAge(Number(e.target.value))} />
//               <FormErrorMessage>{errors.age}</FormErrorMessage>
//             </FormControl>
//             <FormControl id="gender" isRequired isInvalid={!!errors.gender}>
//               <FormLabel>Gender</FormLabel>
//               <Select value={gender} onChange={(e) => setGender(e.target.value)}>
//                 <option value=""></option>
//                 <option value="male">Male</option>
//                 <option value="female">Female</option>
//                 <option value="other">Other</option>
//               </Select>
//               <FormErrorMessage>{errors.gender}</FormErrorMessage>
//             </FormControl>
//             <FormControl id="activityLevel" isRequired isInvalid={!!errors.activityLevel}>
//               <FormLabel>Activity Level</FormLabel>
//               <Select value={activityLevel} onChange={(e) => setActivityLevel(e.target.value)}>
//                 <option value=""></option>
//                 <option value="light">Light</option>
//                 <option value="moderate">Moderate</option>
//                 <option value="active">Active</option>
//                 <option value="very active">Very Active</option>
//               </Select>
//               <FormErrorMessage>{errors.activityLevel}</FormErrorMessage>
//             </FormControl>
//             <FormControl id="height" isRequired isInvalid={!!errors.height}>
//               <FormLabel>Height (cm)</FormLabel>
//               <Input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} />
//               <FormErrorMessage>{errors.height}</FormErrorMessage>
//             </FormControl>
//             <FormControl id="weight" isRequired isInvalid={!!errors.weight}>
//               <FormLabel>Weight (kg)</FormLabel>
//               <Input type="number" value={weight} onChange={(e) => setWeight(Number(e.target.value))} />
//               <FormErrorMessage>{errors.weight}</FormErrorMessage>
//             </FormControl>
//             <Button type="submit" colorScheme="teal" size="lg" mt={4}>
//               Save
//             </Button>
//           </form>
//         </VStack>
//       </Container>
//     </Sidenav>
//   );
// };

// export default ProfileSetup;

import React, { useState, useContext, FormEvent } from 'react';
import axiosInstance from "../../utils/axiosInstance.ts"; 
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, VStack, Input, Button, Heading, Select, FormControl, FormLabel, FormErrorMessage, Text, Box } from "@chakra-ui/react";
import { Sidenav } from "../../Components/Sections";
import { UserContext } from "../../contexts/UserContext";

const ProfileSetup: React.FC = () => {
  const location = useLocation();
  const profile = location.state?.profile || {};
  const [name, setName] = useState<string>(profile.name || '');
  const [age, setAge] = useState<number | string>(profile.age || '');
  const [gender, setGender] = useState<string>(profile.gender || '');
  const [activityLevel, setActivityLevel] = useState<string>(profile.activityLevel || '');
  const [height, setHeight] = useState<number | string>(profile.height || '');
  const [weight, setWeight] = useState<number | string>(profile.weight || '');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();
  const userContext = useContext(UserContext);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!name) newErrors.name = "Name is required";
    if (!age || Number(age) <= 0) newErrors.age = "Age must be a positive number";
    if (!gender) newErrors.gender = "Gender is required";
    if (!activityLevel) newErrors.activityLevel = "Activity Level is required";
    if (!height || Number(height) <= 0) newErrors.height = "Height must be greater than 0";
    if (!weight || Number(weight) <= 0) newErrors.weight = "Weight must be a positive number";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const token = localStorage.getItem("token") || "";
      const data = { name, age, gender, activityLevel, height, weight };

      const response = await axiosInstance.post('/api/user/profile/setup', data, {
        headers: { Authorization: `Bearer ${token}` }
      });

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
      console.error('Error updating profile', error);
      navigate('/dashboard');
    }
  };

  return (
    <Sidenav>
      <Container>
        <VStack gap={4} align="center">
          <Heading>Profile Setup</Heading>
          <form onSubmit={handleSubmit}>
            {Object.values(errors).map((err, index) => (
              <Text key={index} color="red.500">{err}</Text>
            ))}
            <Box bg="yellow.50" p={4} borderRadius="md" mb={4}>
              <FormControl id="name" isRequired isInvalid={!!errors.name}>
                <FormLabel>Name</FormLabel>
                <Input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                <FormErrorMessage>{errors.name}</FormErrorMessage>
              </FormControl>
            </Box>
            <Box bg="yellow.50" p={4} borderRadius="md" mb={4}>
              <FormControl id="age" isRequired isInvalid={!!errors.age}>
                <FormLabel>Age (years)</FormLabel>
                <Input type="number" value={age} onChange={(e) => setAge(Number(e.target.value))} />
                <FormErrorMessage>{errors.age}</FormErrorMessage>
              </FormControl>
            </Box>
            <Box bg="yellow.50" p={4} borderRadius="md" mb={4}>
              <FormControl id="gender" isRequired isInvalid={!!errors.gender}>
                <FormLabel>Gender</FormLabel>
                <Select value={gender} onChange={(e) => setGender(e.target.value)}>
                  <option value=""></option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </Select>
                <FormErrorMessage>{errors.gender}</FormErrorMessage>
              </FormControl>
            </Box>
            <Box bg="yellow.50" p={4} borderRadius="md" mb={4}>
              <FormControl id="activityLevel" isRequired isInvalid={!!errors.activityLevel}>
                <FormLabel>Activity Level</FormLabel>
                <Select value={activityLevel} onChange={(e) => setActivityLevel(e.target.value)}>
                  <option value=""></option>
                  <option value="light">Light</option>
                  <option value="moderate">Moderate</option>
                  <option value="active">Active</option>
                  <option value="very active">Very Active</option>
                </Select>
                <FormErrorMessage>{errors.activityLevel}</FormErrorMessage>
              </FormControl>
            </Box>
            <Box bg="yellow.50" p={4} borderRadius="md" mb={4}>
              <FormControl id="height" isRequired isInvalid={!!errors.height}>
                <FormLabel>Height (cm)</FormLabel>
                <Input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} />
                <FormErrorMessage>{errors.height}</FormErrorMessage>
              </FormControl>
            </Box>
            <Box bg="yellow.50" p={4} borderRadius="md" mb={4}>
              <FormControl id="weight" isRequired isInvalid={!!errors.weight}>
                <FormLabel>Weight (kg)</FormLabel>
                <Input type="number" value={weight} onChange={(e) => setWeight(Number(e.target.value))} />
                <FormErrorMessage>{errors.weight}</FormErrorMessage>
              </FormControl>
            </Box>
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