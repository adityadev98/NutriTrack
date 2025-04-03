"use client";
import { useState, useContext} from "react";
import { Flex, Heading, Stack, Text, Button, Image } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { HeroPic } from "../../../assets/index.ts";
import {AuthModal} from "../index.ts";
const MotionHeading = motion.create(Heading);
const MotionText = motion.create(Text); 
const MotionButton = motion.create(Button);
import { UserContext } from "../../../contexts/UserContext.tsx"; 

export default function HomepageHero() {
  const [openSignUp, setOpenSignUp] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const userContext = useContext(UserContext);
  const loggedUser = userContext?.loggedUser || null;
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
        fontSize={{ base: "clamp(4rem, 10vw, 8rem)" }} 
        lineHeight={"60%"}
        color={'var(--bright-green)'}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        zIndex={8} position="relative"
      >
        SHAPE YOUR FUTURE
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
        Take control of your nutrition journey with personalized insights, smart tracking, and expert guidance — all in one place. Whether you're aiming for better health, peak performance, or balanced living, NutriTrack is your companion every step of the way.
        </MotionText>
        {!loggedUser ? (
            <>
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
            </>
            ) : (
            <>
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
              >
                <a href="/dashboard" >
                  User Dashboard
                </a>
              </MotionButton>
            </>
          )}
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
      {/* ✅ Centralized Authentication Modals */}
      <AuthModal
        openSignIn={openSignIn}
        setOpenSignIn={setOpenSignIn}
        openSignUp={openSignUp}
        setOpenSignUp={setOpenSignUp}
      />
    </Flex>
    
  );
}
