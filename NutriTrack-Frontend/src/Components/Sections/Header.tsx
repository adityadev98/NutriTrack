import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Box, Text, Button, BoxProps } from "@chakra-ui/react";
import Logo from "/vite.svg"; // ✅ Corrected logo import

interface MenuItemProps extends BoxProps {
  children: React.ReactNode;
  isLast?: boolean;
  to: string;
}

const MenuItem: React.FC<MenuItemProps> = ({ children, isLast = false, to = "/", ...rest }) => {
  return (
    <Text mb={{ base: isLast ? 0 : 8, sm: 0 }} mr={{ base: 0, sm: isLast ? 0 : 8 }} display="block" {...rest}>
      <Link to={to}>{children}</Link>
    </Text>
  );
};

const CloseIcon: React.FC = () => (
  <svg width="24" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
    <title>Close</title>
    <path fill="white" d="M9.00023 7.58599L13.9502 2.63599L15.3642 4.04999L10.4142 8.99999L15.3642 13.95L13.9502 15.364L9.00023 10.414L4.05023 15.364L2.63623 13.95L7.58623 8.99999L2.63623 4.04999L4.05023 2.63599L9.00023 7.58599Z" />
  </svg>
);

const MenuIcon: React.FC = () => (
  <svg width="24px" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" fill="white">
    <title>Menu</title>
    <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
  </svg>
);

interface HeaderProps extends BoxProps {}

const Header: React.FC<HeaderProps> = (props) => {
  const [show, setShow] = useState(false);
  const toggleMenu = () => setShow(!show);

  return (
    <Box as="nav" w="100%" mb={8} p={8} bg={["primary.500", "primary.500", "transparent", "transparent"]} color={["white", "white", "primary.700", "primary.700"]} {...props}>
      <Box>
        <img src={Logo} alt="Logo" width="100px" /> {/* ✅ Logo rendering fixed */}
      </Box>

      <Box display={{ base: "block", md: "none" }} onClick={toggleMenu}>
        {show ? <CloseIcon /> : <MenuIcon />}
      </Box>

      <Box display={{ base: show ? "block" : "none", md: "block" }} flexBasis={{ base: "100%", md: "auto" }}>
        <Box display="flex" flexDirection={["column", "row", "row", "row"]} justifyContent="space-between" alignItems="center" pt={[4, 4, 0, 0]}>
          <MenuItem to="/">Home</MenuItem>
          <MenuItem to="/how">How It Works</MenuItem>
          <MenuItem to="/features">Features</MenuItem>
          <MenuItem to="/pricing">Pricing</MenuItem>
          <MenuItem to="/signup" isLast>
            <Button size="sm" rounded="md" color={["primary.500", "primary.500", "white", "white"]} bg={["white", "white", "primary.500", "primary.500"]} _hover={{ bg: ["primary.100", "primary.100", "primary.600", "primary.600"] }}>
              Create Account
            </Button>
          </MenuItem>
        </Box>
      </Box>
    </Box>
  );
};

export default Header;
