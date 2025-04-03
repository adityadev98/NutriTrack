import {
    Box,
    Heading,
    Text,
    VStack,
    Input,
    Button,
    FormControl,
    FormLabel,
    FormErrorMessage,
    Container,
    useToast,
  } from "@chakra-ui/react";
  import { useContext, useEffect, useState } from "react";
  import { CoachNav } from "../../Components/Sections";
  import axiosInstance from "../../utils/axiosInstance";
  import { UserContext } from "../../contexts/UserContext";
  
  const CoachProfile = () => {
    const { loggedUser } = useContext(UserContext) ?? {};
    const [profile, setProfile] = useState<any>({});
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const toast = useToast();
  
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get("/api/coach/profile", {
          headers: { Authorization: `Bearer ${loggedUser?.token}` },
        });
        if (res.data.success) setProfile(res.data.profileData);
      } catch (err) {
        console.error("Failed to load coach profile", err);
      }
    };
  
    useEffect(() => {
      fetchProfile();
    }, [loggedUser?.token]);
  
    const handleChange = (field: string, value: any) => {
      setProfile({ ...profile, [field]: value });
    };
  
    const handleAddressChange = (field: string, value: string) => {
      setProfile({
        ...profile,
        address: { ...profile.address, [field]: value },
      });
    };
  
    const validate = () => {
      const newErrors: { [key: string]: string } = {};
      if (!profile.name) newErrors.name = "Name is required";
      if (!profile.speciality) newErrors.speciality = "Speciality is required";
      if (!profile.degree) newErrors.degree = "Degree is required";
      if (!profile.experience) newErrors.experience = "Experience is required";
      if (!profile.about) newErrors.about = "About section is required";
      if (!profile.fees || profile.fees <= 0) newErrors.fees = "Fees must be positive";
      if (!profile.address?.city) newErrors.city = "City is required";
      if (!profile.address?.zip) newErrors.zip = "ZIP is required";
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };
  
    const handleSubmit = async () => {
      if (!validate()) return;
      try {
        await axiosInstance.post(
          "/api/coach/update-coach",
          profile,
          {
            headers: { Authorization: `Bearer ${loggedUser?.token}` },
          }
        );
        toast({
          title: "Profile updated successfully!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        fetchProfile();
      } catch (error) {
        console.error("Update failed", error);
        toast({
          title: "Failed to update profile",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };
  
    return (
      <CoachNav>
        <Box bg="white" boxShadow="md" borderRadius="lg" p={0} mb={10}>
          <Box bg="var(--dark-green)" borderTopRadius="lg" px={6} py={4}>
            <Heading size="lg" color="white">Coach Profile</Heading>
          </Box>
          <Box p={6} borderBottomRadius="lg" color="var(--dark-green)">
            <Text fontSize="md" fontWeight="medium">
              Update your professional details to help users better understand your qualifications and expertise.
            </Text>
          </Box>
        </Box>
  
        <Container maxW="container.sm" py={6}>
          <Box bg="white" boxShadow="md" borderRadius="lg" p={6}>
            <VStack gap={4} align="stretch">
              <FormControl id="name" isRequired isInvalid={!!errors.name}>
                <FormLabel>Name</FormLabel>
                <Input value={profile.name || ""} onChange={(e) => handleChange("name", e.target.value)} />
                <FormErrorMessage>{errors.name}</FormErrorMessage>
              </FormControl>
  
              <FormControl id="speciality" isRequired isInvalid={!!errors.speciality}>
                <FormLabel>Speciality</FormLabel>
                <Input value={profile.speciality || ""} onChange={(e) => handleChange("speciality", e.target.value)} />
                <FormErrorMessage>{errors.speciality}</FormErrorMessage>
              </FormControl>
  
              <FormControl id="degree" isRequired isInvalid={!!errors.degree}>
                <FormLabel>Degree</FormLabel>
                <Input value={profile.degree || ""} onChange={(e) => handleChange("degree", e.target.value)} />
                <FormErrorMessage>{errors.degree}</FormErrorMessage>
              </FormControl>
  
              <FormControl id="experience" isRequired isInvalid={!!errors.experience}>
                <FormLabel>Experience</FormLabel>
                <Input value={profile.experience || ""} onChange={(e) => handleChange("experience", e.target.value)} />
                <FormErrorMessage>{errors.experience}</FormErrorMessage>
              </FormControl>
  
              <FormControl id="about" isRequired isInvalid={!!errors.about}>
                <FormLabel>About</FormLabel>
                <Input value={profile.about || ""} onChange={(e) => handleChange("about", e.target.value)} />
                <FormErrorMessage>{errors.about}</FormErrorMessage>
              </FormControl>
  
              <FormControl id="fees" isRequired isInvalid={!!errors.fees}>
                <FormLabel>Fees ($)</FormLabel>
                <Input type="number" value={profile.fees || ""} onChange={(e) => handleChange("fees", parseInt(e.target.value))} />
                <FormErrorMessage>{errors.fees}</FormErrorMessage>
              </FormControl>
  
              <FormControl id="city" isRequired isInvalid={!!errors.city}>
                <FormLabel>City</FormLabel>
                <Input value={profile.address?.city || ""} onChange={(e) => handleAddressChange("city", e.target.value)} />
                <FormErrorMessage>{errors.city}</FormErrorMessage>
              </FormControl>
  
              <FormControl id="state">
                <FormLabel>State</FormLabel>
                <Input value={profile.address?.state || ""} onChange={(e) => handleAddressChange("state", e.target.value)} />
              </FormControl>
  
              <FormControl id="zip" isRequired isInvalid={!!errors.zip}>
                <FormLabel>ZIP Code</FormLabel>
                <Input value={profile.address?.zip || ""} onChange={(e) => handleAddressChange("zip", e.target.value)} />
                <FormErrorMessage>{errors.zip}</FormErrorMessage>
              </FormControl>
  
              <Button colorScheme="green" size="lg" mt={4} onClick={handleSubmit}>
                Save
              </Button>
            </VStack>
          </Box>
        </Container>
      </CoachNav>
    );
  };
  
  export default CoachProfile;
  