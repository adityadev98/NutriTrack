import { Box, Flex, Text, Image, Button, Link} from "@chakra-ui/react";
import {Navbar, Footer} from "../Components/Sections";

export default function NotFoundPage() {
  return (
    <Box className="w-full min-h-screen flex flex-col">
		<Box className="fixed top-0 left-0 w-full z-50 bg-navbar">
      <Navbar />
    </Box>
    <Flex 
      flex="1"
      align="center" 
      justify="center" 
      bg={'var(--light-beige)'} 
      px={6}      
    >
      {/* Left Image (Slot Machine 404) */}
      <Box flex="1" display="flex" justifyContent="center">
        <Image 
          src="/404-slot-machine.png"  // Replace with your actual image path
          alt="404 Error Slot Machine"
          maxW="300px"
        />
      </Box>

      {/* Right Text Section */}
      <Box flex="1" textAlign="center">
        <Text fontSize="2xl" fontWeight="bold" color="gray.800">
          Uh oh. That page doesn't exist.
        </Text>
        <Text fontSize="lg" color="gray.600" mt={2}>
          Head to our{" "}
          <Link href="/" color="blue.500" textDecoration="underline">
            homepage
          </Link>{" "}
          that does exist!
        </Text>
        <Button 
          mt={6} 
          as={'a'} 
          fontSize={'15px'} 
          fontFamily={'Rubik, sans-serif'} 
          fontWeight={600} 
          color={'var(--light-beige)'}   // Uses --dark-green for text
          bg={'var(--dark-green)'} // Uses --bright-green for background
          px={'16px'} 
          py={'9px'} 
          tabIndex={0} // Enables keyboard focusability
          role="link"  // Explicitly sets the role as a link
          aria-label="Home"  // Adds a label for screen readers
          borderRadius={'6px'}
          _hover={{
            outline: "2px solid var(--bright-green)", // ✅ Provides clear focus visibility
            outlineOffset: "2px",
          }} 
          _focus={{
            outline: "2px solid var(--bright-green)", // ✅ Provides clear focus visibility
            outlineOffset: "2px",
          }}
          onClick={() => window.location.href = "/"}
        >
          Home
        </Button>
      </Box>
    </Flex>
    <Box className="w-full mt-auto bg-footer">
				<Footer />
			</Box>
		</Box>
  );
}
