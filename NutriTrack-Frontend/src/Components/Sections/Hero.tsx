import { Link } from "react-router-dom";
import {
  Box,
  Button,
  Flex,
  Image,
  Heading,
  Stack,
  Text
} from "@chakra-ui/react";

// ✅ Define the prop types using TypeScript interface
interface HeroProps {
  title?: string;
  subtitle?: string;
  image?: string;
  ctaText?: string;
  ctaLink?: string;
}

// ✅ Convert function to TypeScript format and define prop types
const Hero: React.FC<HeroProps> = ({
  title = "React landing page with Chakra UI",
  subtitle = "This is the subheader section where you describe the basic benefits of your product",
  image = "https://source.unsplash.com/collection/404339/800x600",
  ctaText = "Create your account now",
  ctaLink = "/signup",
  ...rest
}) => {
  return (
    <Flex
      align="center"
      justify={{ base: "center", md: "space-around", xl: "space-between" }}
      direction={{ base: "column-reverse", md: "row" }}
      wrap="no-wrap"
      minH="70vh"
      px={8}
      mb={16}
      {...rest}
    >
      <Stack
        w={{ base: "80%", md: "40%" }}
        align={["center", "center", "flex-start", "flex-start"]}
      >
        <Heading
          as="h1"
          size="xl"
          fontWeight="bold"
          color="primary.800"
          textAlign={["center", "center", "left", "left"]}
        >
          {title}
        </Heading>
        <Heading
          as="h2"
          size="md"
          color="primary.800"
          opacity="0.8"
          fontWeight="normal"
          lineHeight={1.5}
          textAlign={["center", "center", "left", "left"]}
        >
          {subtitle}
        </Heading>
        <Link to={ctaLink}>
          <Button
            colorScheme="primary"
            borderRadius="8px"
            py="4"
            px="4"
            lineHeight="1"
            size="md"
          >
            {ctaText}
          </Button>
        </Link>
        <Text
          fontSize="xs"
          mt={2}
          textAlign="center"
          color="primary.800"
          opacity="0.6"
        >
          No credit card required.
        </Text>
      </Stack>
      <Box w={{ base: "80%", sm: "60%", md: "50%" }} mb={{ base: 12, md: 0 }}>
        {/* TODO: Make this change every X secs */}
        <Image src={image} rounded="1rem" shadow="2xl" />
      </Box>
    </Flex>
  );
};

export default Hero;
