import { useState} from "react";
import {Navbar, Footer} from "../Components/Sections";
import { Flex, Stack, Button,Box, Heading } from "@chakra-ui/react";
import { motion } from "framer-motion";
//import styles from "../../style";
//import {SignInDialog, SignUpDialog} from "../Components/Sections/";
import {AuthModal} from "../Components/Sections/";
const MotionButton = motion(Button);
const MotionHeading = motion(Heading);

const Login = () => {
	const [openSignUp, setOpenSignUp] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
	return (
		<Box className="w-full min-h-screen flex flex-col">
      
			{/* ✅ Fixed Navbar */}
			<Box className="fixed top-0 left-0 w-full z-50 bg-navbar">
				<Navbar />
			</Box>
      
    <Flex
      bg={'var(--light-beige)'} 
      flex="1"
      //align={"center"}
      justify={"center"}
      px={8}
      position="relative"
      pt={{ base: 10, md: 20 }} 
      overflow="hidden" // ✅ Ensures no internal overflow

    >
      <Stack
        textAlign={"center"}
        align={"center"}
        spacing={{ base: 6, md: 8 }}
        maxW={"6xl"}
        //maxH="50vh" // ✅ Ensures children do not overflow
        overflow="hidden" // 🔥 Stops content from expanding beyond 100vh

      >
      <MotionHeading
        mt="5vH"
        fontFamily={"Deacon, sans-serif"}
        fontWeight={800}
        fontSize={{ base: "clamp(4rem, 10vw, 22rem)" }} 
        lineHeight={"80%"}
        color={'var(--dark-green)'}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        NUTRITRACK
      </MotionHeading>

      <MotionHeading
        fontFamily={"Deacon, sans-serif"}
        fontWeight={800}
        fontSize={{ base: "clamp(4rem, 5vw, 10rem)" }} 
        lineHeight={"60%"}
        color={'var(--dark-green)'}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        zIndex={8} position="relative"
      >
        Sign In to Continue
      </MotionHeading>
      <MotionButton
        mt="5vh"
        rounded={"full"}
        px={8}
        py={6}
        borderRadius={'6px'}
        colorScheme={"green"}
        fontFamily={'Rubik, sans-serif'} 
        fontWeight={600} 
        bg={'var(--bright-green)'} 
        color={'var(--dark-green)'} 
        _hover={{ bg: "rgb(119, 228, 110)" }}
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5}}
        tabIndex={0} // Enables keyboard focusability
        role="link"  // Explicitly sets the role as a link
        aria-label="Sign up"  // Adds a label for screen readers
        _focus={{
          outline: "2px solid var(--bright-green)", // ✅ Provides clear focus visibility
          outlineOffset: "2px",
        }}
        zIndex={10} position="relative"
        onClick={() => setOpenSignIn(true)}
      >
        SIGN IN
      </MotionButton>
            
      </Stack>

      {/* ✅ Centralized Authentication Modals */}
      <AuthModal
        openSignIn={openSignIn}
        setOpenSignIn={setOpenSignIn}
        openSignUp={openSignUp}
        setOpenSignUp={setOpenSignUp}
      />
    </Flex>
	
			{/* ✅ Footer stays at bottom */}
			<Box className="w-full mt-auto bg-footer">
				<Footer />
			</Box>
		</Box>
	);
};
export default Login;