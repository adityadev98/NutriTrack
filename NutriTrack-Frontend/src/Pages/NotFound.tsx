import { Link } from "react-router-dom";
import { Box, Button, Heading, Text } from "@chakra-ui/react";

const NotFound = () => {
  return (
    <Box textAlign="center" mt={10}>
      <Heading as="h1" size="xl" mb={6}>
        404 - Page Not Found
      </Heading>
      <Text fontSize="lg" mb={6}>The page you are looking for does not exist.</Text>
      <Button colorScheme="blue" as={Link} to="/">
        Go Home
      </Button>
    </Box>
  );
};

export default NotFound;
