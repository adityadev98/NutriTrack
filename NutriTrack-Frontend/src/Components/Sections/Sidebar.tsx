import { useState, useContext } from "react";
import {
  Box,
  Flex,
  Text,
  Button,
  IconButton,
  VStack,
  Divider,
  Collapse,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { useLocation } from "react-router-dom";
import { logo } from "../../Assets/index.ts";
import { navLinks } from "../../Constants/index.ts";
import { UserContext } from "../../contexts/UserContext.tsx";


const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true); // Sidebar is open by default
  const location = useLocation();
  const { logout } = useContext(UserContext) ?? {};
  return (
    <Box position="fixed" left={0} top={0} h="100vh" w="250px" bg="var(--dark-green)" color="white" p={4}>
      {/* Sidebar Toggle Button */}
      <IconButton
        aria-label="Toggle Sidebar"
        icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
        onClick={() => setIsOpen(!isOpen)}
        bg="var(--bright-green)"
        color="white"
        position="absolute"
        top={4}
        right={-10} // Keeps button inside sidebar
        _hover={{ bg: "rgba(84, 221, 72, 0.8)" }}
      />

      {/* Sidebar Content */}
      <Collapse in={isOpen}>
        <Flex direction="column" h="full" justify="space-between">
          {/* Logo */}
          <Box textAlign="center" mb={4}>
            <a href="/">
              <img src={logo} alt="NutriTrack" width="150px" />
            </a>
          </Box>

          {/* Navigation Links */}
          <VStack align="start" spacing={4}>
            {navLinks.map((nav) => {
              const isActive = location.pathname === `/${nav.id}` || (location.pathname === "/" && nav.id === "home");

              return (
                <Button
                  key={nav.id}
                  as="a"
                  href={`/${nav.id}`}
                  variant="ghost"
                  colorScheme="whiteAlpha"
                  color={isActive ? "var(--bright-green)" : "white"}
                  fontSize="16px"
                  width="100%"
                  justifyContent="start"
                  _hover={{ color: "var(--bright-green)" }}
                >
                  {nav.title}
                </Button>
              );
            })}
          </VStack>

          {/* Divider */}
          <Divider my={4} borderColor="rgba(255,255,255,0.2)" />
          <Button 
                colorScheme="red" 
                onClick={logout} 
                size="lg"
            >
                Logout
            </Button>
        </Flex>
      </Collapse>
    </Box>
  );
};

export default Sidebar;
