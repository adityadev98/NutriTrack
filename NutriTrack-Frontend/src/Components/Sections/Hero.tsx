"use client";
import { useState } from "react";
import { Flex, Heading, Stack, Text, Button, Image } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { HeroPic } from "../../Assets/index.ts";
import {SignInDialog, SignUpDialog} from "../../Components/Sections/";
const MotionHeading = motion(Heading);
const MotionText = motion(Text);
const MotionButton = motion(Button);


export default function Hero() {
  const [openSignUp, setOpenSignUp] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  return (
    <Flex
      bg={'var(--dark-green)'} 
      minH={"100vh"}
      //align={"center"}
      justify={"center"}
      px={8}
      position="relative"
      pt={{ base: 10, md: 20 }} 
      overflow="hidden" // ✅ Ensures no internal overflow
      maxH="100vh"

    >
      <Stack
        textAlign={"center"}
        align={"center"}
        spacing={{ base: 6, md: 8 }}
        maxW={"6xl"}
        maxH="100vh" // ✅ Ensures children do not overflow
        overflow="hidden" // 🔥 Stops content from expanding beyond 100vh

      >
      <MotionHeading
        fontFamily={"Deacon, sans-serif"}
        fontWeight={800}
        fontSize={{ base: "clamp(4rem, 10vw, 22rem)" }} 
        lineHeight={"80%"}
        color={'var(--soft-white)'}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        NUTRITRACK
      </MotionHeading>

      <MotionHeading
        fontFamily={"Deacon, sans-serif"}
        fontWeight={800}
        fontSize={{ base: "clamp(4rem, 10vw, 22rem)" }} 
        lineHeight={"60%"}
        color={'var(--bright-green)'}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        zIndex={8} position="relative"
      >
        THE FUTURE
      </MotionHeading>

        <MotionText
          color={'var(--soft-white)'}
          maxW={"2xl"}
          fontSize={{ base: "md", md: "lg" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          lineHeight={"130%"}
          transition={{ duration: 1, delay: 1 }}
          pt={4}
          fontFamily={'Rubik, sans-serif'} 
          fontWeight={400} 
          zIndex={9} position="relative"
        >
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia,
molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum
        </MotionText>
        <MotionButton
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
          transition={{ duration: 0.5, delay: 1.5 }}
          tabIndex={0} // Enables keyboard focusability
          role="link"  // Explicitly sets the role as a link
          aria-label="Sign up"  // Adds a label for screen readers
          _focus={{
            outline: "2px solid var(--bright-green)", // ✅ Provides clear focus visibility
            outlineOffset: "2px",
          }}
          zIndex={10} position="relative"
          onClick={() => setOpenSignUp(true)}
        >
          SIGN UP
        </MotionButton>
      </Stack>
      <Flex
      position="absolute"
      w="full"
      bottom="0"
      left="0"
      zIndex={0}
      overflow="hidden"
      >
      <Image
        src={HeroPic}
        alt="Hero Background"
        objectFit="cover"
        w="100%"
        h="100%"
      />
     </Flex>
     <SignUpDialog 
        open={openSignUp} 
        onClose={() => setOpenSignUp(false)} 
        openSignIn={() => setOpenSignIn(true)} // ✅ Pass function to open SignIn Dialog
      />

      <SignInDialog 
        open={openSignIn} 
        onClose={() => setOpenSignIn(false)} 
        openSignUp={() => setOpenSignUp(true)} // ✅ Pass function to open SignUp Dialog
      />
    </Flex>
    
  );
}
