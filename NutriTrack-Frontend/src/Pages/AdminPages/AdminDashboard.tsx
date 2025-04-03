import { Box, Heading, Text, Input, Button, useToast, VStack } from "@chakra-ui/react";
import { Sidebar } from "../../Components/Sections";
import { useContext, useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { UserContext } from "../../contexts/UserContext";

const AdminDashboard = () => {
  const { loggedUser } = useContext(UserContext) ?? {};
  const toast = useToast();
  const [userId, setUserId] = useState("");
  const [coachId, setCoachId] = useState("");
  const [emailQuery, setEmailQuery] = useState("");
  const [fetchedUserId, setFetchedUserId] = useState("");
  const [dashData, setDashData] = useState<any>(null);

  const fetchDashboard = async () => {
    try {
      const res = await axiosInstance.get("/api/admin/dashboard", {
        headers: { Authorization: `Bearer ${loggedUser?.token}` },
      });
      setDashData(res.data.dashData);
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

  const promoteToAdmin = async () => {
    try {
      const res = await axiosInstance.post(
        "/api/admin/promote-to-admin",
        { userId },
        {
          headers: { Authorization: `Bearer ${loggedUser?.token}` },
        }
      );
      toast({
        title: res.data.message || "Promoted to Admin",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: "Failed to promote to Admin",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const promoteToCoach = async () => {
    try {
      const res = await axiosInstance.post(
        "/api/admin/promote-to-coach",
        { userId: coachId },
        {
          headers: { Authorization: `Bearer ${loggedUser?.token}` },
        }
      );
      toast({
        title: res.data.message || "Promoted to Coach",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: "Failed to promote to Coach",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const fetchUserIdFromEmail = async () => {
    try {
      const res = await axiosInstance.post(
        "/api/admin/getID",
        { email: emailQuery },
        {
          headers: { Authorization: `Bearer ${loggedUser?.token}` },
        }
      );
      if (res.data.success && res.data.userId) {
        setFetchedUserId(res.data.userId);
        toast({
          title: "User ID fetched successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: res.data.message || "User not found",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (err) {
      toast({
        title: "Failed to fetch user ID",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Sidebar>
      <Box bg="white" boxShadow="md" borderRadius="lg" p={0} mb={10}>
        <Box bg="var(--dark-green)" borderTopRadius="lg" px={6} py={4}>
          <Heading size="lg" color="white">Admin Dashboard</Heading>
        </Box>
        <Box p={6} borderBottomRadius="lg" color="var(--dark-green)">
          <Text fontSize="md" fontWeight="medium">
            Manage platform statistics and promote users to coach or admin roles.
          </Text>
        </Box>
      </Box>

      {/* Overview Box */}
      <Box bg="white" boxShadow="md" borderRadius="lg" p={6} mb={8}>
        <Heading size="md" color="var(--dark-green)" mb={4}>Overview</Heading>
        {dashData ? (
          <VStack spacing={4} align="stretch">
            <Text><b>Coaches:</b> {dashData.coaches}</Text>
            <Text><b>Patients:</b> {dashData.patients}</Text>
            <Text><b>Total Appointments:</b> {dashData.appointments}</Text>
          </VStack>
        ) : (
          <Text>Loading dashboard data...</Text>
        )}
      </Box>

      {/* Get User ID from Email Box */}
      <Box bg="white" boxShadow="md" borderRadius="lg" p={6} mb={8}>
        <Heading size="md" color="var(--dark-green)" mb={4}>Find User ID by Email</Heading>
        <Text fontSize="md" fontWeight="medium" mb={4}>
          Enter the email address of a user to retrieve their user ID for admin or coach promotion.
        </Text>
        <Input
          placeholder="Enter Email Address"
          value={emailQuery}
          onChange={(e) => setEmailQuery(e.target.value)}
          mb={4}
        />
        <Button colorScheme="purple" onClick={fetchUserIdFromEmail} mb={2}>Get User ID</Button>
        {fetchedUserId && (
          <Text fontWeight="medium" mt={2} color="var(--dark-green)">
            User ID: <strong>{fetchedUserId}</strong>
          </Text>
        )}
      </Box>

      {/* Promote to Admin Box */}
      <Box bg="white" boxShadow="md" borderRadius="lg" p={6} mb={8}>
        <Heading size="md" color="var(--dark-green)" mb={4}>Promote to Admin</Heading>
        <Text fontSize="md" fontWeight="medium" mb={4}>
          Enter a user ID below to grant them administrative privileges.
        </Text>
        <Input
          placeholder="Enter User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          mb={4}
        />
        <Button colorScheme="green" onClick={promoteToAdmin}>Promote to Admin</Button>
      </Box>

      {/* Promote to Coach Box */}
      <Box bg="white" boxShadow="md" borderRadius="lg" p={6} mb={8}>
        <Heading size="md" color="var(--dark-green)" mb={4}>Promote to Coach</Heading>
        <Text fontSize="md" fontWeight="medium" mb={4}>
          Enter a user ID to promote them to a coach. They'll appear to users for appointments after completing their profile.
        </Text>
        <Input
          placeholder="Enter User ID"
          value={coachId}
          onChange={(e) => setCoachId(e.target.value)}
          mb={4}
        />
        <Button colorScheme="blue" onClick={promoteToCoach}>Promote to Coach</Button>
      </Box>

    </Sidebar>
  );
};

export default AdminDashboard;