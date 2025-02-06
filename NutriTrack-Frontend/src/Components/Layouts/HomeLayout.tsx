import { Flex, FlexProps } from "@chakra-ui/react";
import Header from "../Sections/Header";
import { ReactNode } from "react";

// ✅ Define prop types using TypeScript interface
interface LandingLayoutProps extends FlexProps {
  children: ReactNode; // Ensure children are properly typed
}

// ✅ Convert function to TypeScript format and define prop types
const LandingLayout: React.FC<LandingLayoutProps> = ({ children, ...props }) => {
  return (
    <Flex
      direction="column"
      align="center"
      maxW={{ xl: "1200px" }}
      m="0 auto"
      {...props} // Spread the rest of the props to maintain flexibility
    >
      <Header />
      {children}
    </Flex>
  );
};

export default LandingLayout;
