import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { Button, Box, Heading } from "@chakra-ui/react";

const AdminDashboard = () => {
  const { logout } = useContext(UserContext) ?? {};

  return (
    <Box textAlign="center" mt={10}>
      <Heading as="h1" size="xl" mb={6}>
        Admin Dashboard
      </Heading>
      <Button 
        colorScheme="red" 
        onClick={logout} 
        size="lg"
      >
        Logout
      </Button>
    </Box>
  );
};

export default AdminDashboard;
