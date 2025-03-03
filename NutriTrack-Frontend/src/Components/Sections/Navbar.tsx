'use client'
import { useState, useContext, FC } from "react";
import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  //useColorModeValue,
  useDisclosure,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  Icon,
} from '@chakra-ui/react'
import {
  HamburgerIcon,
  CloseIcon,
} from '@chakra-ui/icons'
import { useLocation } from "react-router-dom";
import { logo } from "../../assets/index.ts";
import { navLinks } from "../../Constants";

import {SignInDialog, SignUpDialog} from "../../Components/Sections/";
import { UserContext } from "../../contexts/UserContext"; 

import { GrPowerShutdown } from "react-icons/gr";
import { RiAccountCircleFill } from "react-icons/ri";
import { RxDashboard } from "react-icons/rx";

export default function Navbar() {
  const { isOpen, onToggle } = useDisclosure()
  const [openSignUp, setOpenSignUp] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const userContext = useContext(UserContext);
  const loggedUser = userContext?.loggedUser || null;
  const logout = userContext?.logout || (() => {});

  return (
    <Box>
      <Flex
        minH={'60px'}
        py={{ base: 4 }}
        px={{ base: 5 }}
        //borderBottom={1}
        //borderStyle={'solid'}
        //borderColor={useColorModeValue('gray.200', 'gray.900')}
        align={'center'}
        justify="space-between"
        display={{ base: 'none', lg: 'flex' }}
        >
          <Flex flex="1" justify={'start'}>
            <a href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
              <img src={logo} alt="NutriTrack" className="w-[170px] h-[32px]" />
            </a>
          </Flex>

          <Flex flex="2" ml={10} mr={10} justify={'center'}>
              <DesktopNav />
          </Flex>
          <Stack
            flex="1"
            justify={'flex-end'}
            direction={'row'}
            spacing={6}>
            {!loggedUser ? (
            <>
              <Button 
                as={'a'} 
                fontSize={'15px'} 
                fontFamily={'Rubik, sans-serif'} 
                fontWeight={600} 
                color={'var(--off-white)'} 
                bg={'var(--dark-green)'} 
                px={'16px'} 
                py={'12px'} 
                tabIndex={0} // Enables keyboard focusability
                role="link"  // Explicitly sets the role as a link
                aria-label="Log in to your account"  // Adds a label for screen readers
                border={'1px solid rgba(243, 237, 228, 0.5)'} 
                borderRadius={'6px'}
                _hover={{
                  bg: 'rgba(18, 35, 21, 0.8)', // Dark green with slight transparency
                }} 
                _focus={{
                  outline: "2px solid var(--bright-green)", // ✅ Provides clear focus visibility
                  outlineOffset: "2px",
                }}
                onClick={() => setOpenSignIn(true)}>
                LOG IN
              </Button>
              <Button 
                as={'a'} 
                fontSize={'15px'} 
                fontFamily={'Rubik, sans-serif'} 
                fontWeight={600} 
                color={'var(--dark-green)'}  // Uses --dark-green for text
                bg={'var(--bright-green)'}  // Uses --bright-green for background
                px={'16px'} 
                py={'9px'} 
                tabIndex={0} // Enables keyboard focusability
                role="link"  // Explicitly sets the role as a link
                aria-label="Sign up"  // Adds a label for screen readers
                borderRadius={'6px'}
                _hover={{
                  bg: 'rgba(84, 221, 72, 0.8)',  // Adjusted slightly darker version of --bright-green
                }} 
                _focus={{
                  outline: "2px solid var(--bright-green)", // ✅ Provides clear focus visibility
                  outlineOffset: "2px",
                }}
                onClick={() => setOpenSignUp(true)}>
                SIGN UP
              </Button>
              </>
          ) : (
            <>
              <Menu>
              <MenuButton
                px={'16px'} 
                py={'12px'} 
                tabIndex={0} // Enables keyboard focusability
                aria-label="User Avatar"  // Adds a label for screen readers  
                _hover={{ bg: "none" }}
              >
                <Avatar name={loggedUser?.name || "User"} bg='var(--bright-green)' size='md' />
              </MenuButton>
              <MenuList>
                  <MenuItem 
                  as={'a'}
                  href="/dashboard" 
                  tabIndex={0} // Enables keyboard focusability
                  role="link"  // Explicitly sets the role as a link
                  aria-label="Go to User Dashboard"  // Adds a label for screen readers
                  fontSize={'14px'} 
                  fontFamily={'Rubik, sans-serif'} 
                  fontWeight={400} 
                  >
                    <Icon as={RxDashboard} boxSize="25px" mr="10px" />
                    Dashboard</MenuItem>
                  <MenuItem
                    as={'a'}
                    href="/dashboard" 
                    tabIndex={0} // Enables keyboard focusability
                    role="link"  // Explicitly sets the role as a link
                    aria-label="Go to User Account Details"  // Adds a label for screen readers
                    fontSize={'14px'} 
                    fontFamily={'Rubik, sans-serif'} 
                    fontWeight={400} 
                  >
                    <Icon as={RiAccountCircleFill} boxSize="25px" mr="10px" />
                    My Account
                  </MenuItem>
                  <MenuItem 
                  onClick={logout}
                  tabIndex={0} // Enables keyboard focusability
                  role="link"  // Explicitly sets the role as a link
                  aria-label="Sign Out"  // Adds a label for screen readers
                  fontSize={'14px'} 
                  fontFamily={'Rubik, sans-serif'} 
                  fontWeight={400} 
                  >
                    <Icon as={GrPowerShutdown} boxSize="25px" mr="10px" />
                    Sign Out
                </MenuItem>
              </MenuList>
              </Menu>
            </>
          )}
          </Stack>
      </Flex>
      {/* Mobile Menu */}
      <Flex 
      minH={'60px'}
      py={{ base: 4 }}
      px={{ base: 5 }}
      align={'center'}
      justify="space-between" 
      display={{ base: 'flex', lg: 'none' }}
      >
          <Flex flex="1" />
          <Flex flex={1}  justify={'center'} >
              <img src={logo} alt="NutriTrack" className="w-[124px] h-[32px]" />
          </Flex>
          <Flex
            flex="1"
            justify="flex-end"
            px={2}  // Adds spacing from the right edge
            alignItems="center"
          >
            <IconButton
              onClick={onToggle}
              icon={isOpen ? <CloseIcon w={4} h={4} color="var(--dark-green)" /> : <HamburgerIcon w={6} h={6} color="var(--dark-green)" />}
              variant="unstyled"  // Removes default button styles
              aria-label="Toggle Navigation"
              bg="var(--bright-green)"  // Light green background for the circle
              borderRadius="full"  // Makes it a perfect circle
              width="50px"  // Controls the size of the button
              height="50px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              _hover={{ bg: "rgba(84, 221, 72, 0.8)" }}  // Slightly darker green on hover
            />

          </Flex> 
      </Flex>  
      {/* Mobile Nav */}
      <Collapse in={isOpen} animateOpacity>
        <MobileNav loggedUser={loggedUser} logout={logout} />
      </Collapse>
      {/* Sign In & Sign Up Dialogs */}
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

    </Box>
  )
}

const DesktopNav = () => {
  const location = useLocation(); // Get the current route
  const linkColor = "var(--soft-white)";
  const linkHoverColor = 'white';

  return (
    <Stack direction={'row'} spacing={5} align="center">
      {navLinks.map((nav) => {
        const isActive = location.pathname === `/${nav.id}` || (location.pathname === "/" && nav.id === "home");

        return (
          <a key={nav.id} href={`/${nav.id}`} style={{ textDecoration: 'none' }}> 
            <Button 
              fontFamily={'Rubik, sans-serif'} 
              variant="ghost" 
              colorScheme="whiteAlpha" 
              color={linkColor}
              _hover={{
                textDecoration: 'none',
                color: linkHoverColor,
              }}
              fontSize={'15px'}
              justifyContent="center"  
              alignItems="center"
              textAlign="center"  
              position="relative" // Required for the underline effect
              _after={{
                content: '""', 
                position: "absolute", 
                width: "100%", 
                height: "2px", 
                bottom: "1px", // Adjusts the underline position
                left: "0", 
                backgroundColor: isActive ? 'var(--bright-green)' : 'transparent', 
                transition: "background-color 0.2s ease-in-out",
              }}
              width="100%" // Ensures the whole button is clickable
            >
              {nav.title}
            </Button>
          </a>
        );
      })}
    </Stack>
  );
};
interface MobileNavProps {
  loggedUser: any | null; // Replace `any` with a proper user type if available
  logout: () => void;
}
const MobileNav: FC<MobileNavProps> = ({ loggedUser, logout }) => {
  const [openSignUp, setOpenSignUp] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  return (
    <Stack p={4} display={{ lg: 'none' }}  align="center" spacing={5} >
      {navLinks.map((nav) => (
        <Box
        py={2}
        as="a"
        key={nav.id} 
        href={nav.id ?? '#'}
        justifyContent="center"  
        alignItems="center"
        textAlign="center"  
        width="100%"  
        _hover={{ textDecoration: 'none' }}
        >
        <Text fontWeight={600} color="var(--soft-white)" fontFamily={'Rubik, sans-serif'} fontSize={'15px'}  textTransform={'uppercase'} textAlign="center"  py={2} >
          {nav.title}
        </Text>        
      </Box>
      
      ))}

      {!loggedUser ? (
      <>
        <Text fontWeight={600} color="var(--soft-white)" onClick={() => setOpenSignIn(true)} fontFamily={'Rubik, sans-serif'} fontSize={'15px'} textTransform={'uppercase'}  textAlign="center"  py={2}>
          LOG IN
        </Text>     
        <Text fontWeight={600} color="var(--soft-white)" onClick={() => setOpenSignUp(true)} fontFamily={'Rubik, sans-serif'} fontSize={'15px'} textTransform={'uppercase'}  textAlign="center"  py={2}>
          SIGN UP
        </Text>     
      </>
      ) : (
      <>
          <Text fontWeight={600} color="var(--soft-white)" fontFamily={'Rubik, sans-serif'} fontSize={'15px'} textTransform={'uppercase'} textAlign="center" py={2}>
            <a href="/dashboard" style={{  alignItems: 'center'}}>
              Profile
            </a>
          </Text>
          <Text fontWeight={600} color="var(--soft-white)" onClick={logout} fontFamily={'Rubik, sans-serif'} fontSize={'15px'} textTransform={'uppercase'} textAlign="center" py={2}>
            LOG OUT
          </Text>
      </>
      )}

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
    </Stack>

  )
}


