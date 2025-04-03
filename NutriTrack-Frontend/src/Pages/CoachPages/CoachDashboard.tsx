import { useContext, useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  Button,
  Flex,
  useToast,
  Switch,
} from "@chakra-ui/react";
import { CoachNav } from "../../Components/Sections";
import { UserContext } from "../../contexts/UserContext";
import axiosInstance from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

const CoachDashboard = () => {
  const { logout, loggedUser } = useContext(UserContext) ?? {};
  const toast = useToast();
  const navigate = useNavigate();
  const [dashData, setDashData] = useState<any>(null);
  const [available, setAvailable] = useState(false);
  const fetchDashboard = async () => {
    try {
      const res = await axiosInstance.get("/api/coach/dashboard", {
        headers: {
          Authorization: `Bearer ${loggedUser?.token}`,
        },
      });
      setDashData(res.data.dashData);
      setAvailable(res.data.dashData.available || false);
    } catch (err) {
      toast({
        title: "Failed to load dashboard",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    fetchDashboard(); 
  }, [loggedUser?.token]);

  const handleToggleAvailability = async () => {
    try {
      const res = await axiosInstance.post(
        "/api/coach/change-availability",
        {},
        {
          headers: {
            Authorization: `Bearer ${loggedUser?.token}`,
          },
        }
      );
      
      toast({
        title: `Coach is now ${res.data.available ? "Available" : "Not Available"}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      // Refresh dashboard data to reflect updated availability
      fetchDashboard();
    } catch (err) {
      toast({
        title: "Failed to toggle availability",
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
          <Heading size="lg" color="white">Coach Dashboard</Heading>
        </Box>
        <Box p={6} borderBottomRadius="lg" color="var(--dark-green)">
          <Text fontSize="md" fontWeight="medium">
            Manage your coaching profile, monitor earnings, track appointments, and control your availability — all in one place.
          </Text>
        </Box>
      </Box>

      {/* Dashboard Summary */}
      <Box bg="white" boxShadow="md" borderRadius="lg" p={6} mb={8}>
        <Flex justify="space-between" align="flex-start" mb={4}>
          <Heading size="md" color="var(--dark-green)">Overview</Heading>
          <Button colorScheme="green" onClick={() => navigate("/coach-appointments")}>Check Appointments</Button>
        </Flex>
        {dashData ? (
          <Flex direction={{ base: "column", md: "row" }} gap={6}>
            <Box flex={1} p={4} borderRadius="md" bg="gray.50" boxShadow="sm">
              <Text fontWeight="bold" color="var(--dark-green)">Earnings</Text>
              <Text fontSize="2xl">${dashData.earnings}</Text>
            </Box>
            <Box flex={1} p={4} borderRadius="md" bg="gray.50" boxShadow="sm">
              <Text fontWeight="bold" color="var(--dark-green)">Total Patients</Text>
              <Text fontSize="2xl">{dashData.patients}</Text>
              
            </Box>
            <Box flex={1} p={4} borderRadius="md" bg="gray.50" boxShadow="sm">
              
              <Text fontWeight="bold" color="var(--dark-green)">Appointments</Text>
              <Text fontSize="2xl">{dashData.appointments}</Text>
            </Box>
          </Flex>
        ) : (
          <Text>Loading dashboard data...</Text>
        )}
      </Box>

      {/* Availability Toggle */}
      <Box bg="white" boxShadow="md" borderRadius="lg" p={6} mb={8}>
        <Heading size="md" mb={4} color="var(--dark-green)">Availability</Heading>

          <Text fontSize="md" fontWeight="medium" pb={8}>
            Toggle your availability status. When unavailable, you will not appear to users looking to book appointments.
          </Text>


        <Flex align="center" gap={6}>
          <Text
            fontWeight="bold"
            color={available ? "green.600" : "red.600"}
            fontSize="lg"
          >
            {available ? "Available" : "Not Available"}
          </Text>
          <Switch
            size="lg"
            colorScheme="green"
            isChecked={available}
            onChange={handleToggleAvailability}
          />
        </Flex>
      </Box>

      <Box bg="white" boxShadow="md" borderRadius="lg" p={6}>
        <Button colorScheme="red" onClick={logout} size="lg">
          Logout
        </Button>
      </Box>
    </CoachNav>
  );
};

export default CoachDashboard;
