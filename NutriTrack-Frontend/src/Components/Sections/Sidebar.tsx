'use client'
import { useState, useContext } from "react";
import {
  IconButton,
  Avatar,
  Box,
  CloseButton,
  Flex,
  HStack,
  VStack,
  Icon,
  useColorModeValue,
  Text,
  Drawer,
  DrawerContent,
  useDisclosure,
  BoxProps,
  FlexProps,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from '@chakra-ui/react'
import {
  FiMenu,
  FiBell,
  FiChevronDown,
} from 'react-icons/fi'
import { logo } from "../../Assets/index.ts";
import { AdminNavLinks } from "../../Constants/index.ts";
import { UserContext } from "../../contexts/UserContext.tsx";
import { GrPowerShutdown } from "react-icons/gr";
import { RiAccountCircleFill } from "react-icons/ri";
import { RxDashboard } from "react-icons/rx";

interface MobileProps extends FlexProps {
  onOpen: () => void
}

interface SidebarProps extends BoxProps {
  onClose: () => void
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  return (
    <Box
      transition="3s ease"
      bg={"var(--dark-green)"}
      borderRight="1px"
      borderRightColor={'gray.200'}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...rest}>
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
          <a href="/">
            <img src={logo} alt="NutriTrack" width="150px" />
          </a>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
          {/* Navigation Links */}
          <VStack align="start" spacing={4}>
            {AdminNavLinks.map((nav) => {
              const isActive = location.pathname === `/${nav.id}` || (location.pathname === "/" && nav.id === "home");

              return (
                <Box
                as="a"
                key={nav.id}
                href={`/${nav.id}`}
                style={{ textDecoration: 'none' }}
                _focus={{ boxShadow: 'none' }}>
                 <Flex
                  align="center"
                  p="4"
                  mx="4"
                  borderRadius="lg"
                  role="group"
                  cursor="pointer"
                  bg={isActive ? "var(--bright-green)" : "transparent"}
                  color={isActive ? "var(--dark-green)" : "var(--soft-white)"}
                  fontWeight={500}
                  fontFamily={'Rubik, sans-serif'}
                  fontSize={'15px'}
                  _hover={{
                    bg: "var(--bright-green)",
                    color: "var(--dark-green)",
                  }}
                  >
                  <Icon
                    as={nav.icon} 
                    mr="4"
                    fontSize="16"
                    color={isActive ? "var(--dark-green)" : "inherit"}
                    _groupHover={{
                      color:"var(--dark-green)",
                    }}
                  />
                  {nav.title}
                </Flex>
              </Box>
            );
          })}
        </VStack>
    </Box>
  )
}


const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  const userContext = useContext(UserContext);
  const loggedUser = userContext?.loggedUser || null;
  const logout = userContext?.logout || (() => {});
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={"var(--dark-green)"}
      borderBottomWidth="1px"
      borderBottomColor={'gray.200'}
      justifyContent={{ base: 'space-between', md: 'flex-end' }}
      {...rest}>
      <IconButton
        display={{ base: 'flex', md: 'none' }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        color="var(--off-white)"
        icon={<FiMenu />}
      />

      <Flex
        display={{ base: 'flex', md: 'none' }}>
        <a href="/">
            <img src={logo} alt="NutriTrack" width="150px" />
          </a>
      </Flex>

      <HStack spacing={{ base: '0', md: '6' }}>
        <IconButton size="lg" variant="ghost" aria-label="open menu" icon={<FiBell />} />
        <Flex alignItems={'center'}>
          <Menu>
              <MenuButton
                py={2}
                transition="all 0.3s"
                _focus={{ boxShadow: 'none' }} 
                tabIndex={0} // Enables keyboard focusability
                aria-label="User Avatar"  // Adds a label for screen readers  
                _hover={{ bg: "none" }}
              >
              <HStack>
                <Avatar name={loggedUser?.name || "User"} bg='var(--bright-green)' />
                <VStack
                  display={{ base: 'none', md: 'flex' }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2">
                  <Text fontSize="sm"> {loggedUser?.name || "User"}</Text>
                  <Text fontSize="xs" color="gray.600">
                    Admin
                  </Text>
                </VStack>
                <Box display={{ base: 'none', md: 'flex' }}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList
              bg={useColorModeValue('white', 'gray.900')}
              borderColor={useColorModeValue('gray.200', 'gray.700')}>
            <MenuItem 
                  as={'a'}
                  href="/admin-dashboard" 
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
                    href="/profile-setup" 
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
              <MenuDivider />
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
        </Flex>
      </HStack>
    </Flex>
  )
}

const Sidebar: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Box minH="100vh" bg={'gray.100'}>
      <SidebarContent onClose={() => onClose} display={{ base: 'none', md: 'block' }} />
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full">
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        {children} 
      </Box>
    </Box>
  )
}

export default Sidebar