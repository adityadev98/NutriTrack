import { Box, Text } from "@chakra-ui/react";

const HomepageEndSection = () => {
  return (
    <Box
      bg="#193e2e"
      py={28} 
      textAlign="center"
      fontFamily="Deacon, sans-serif"
    >
      <Text
        fontWeight={800}
        fontSize={{ base: "clamp(4rem, 10vw, 8rem)" }}
        lineHeight="80%"
        color="white"
      >
        EAT SMART.
      </Text>
      <Text
        fontWeight={800}
        fontSize={{ base: "clamp(4rem, 10vw, 8rem)" }}
        lineHeight="80%"
        color="yellow.400"
      >
        TRANSFORM YOUR LIFE.
      </Text>
    </Box>
  );
};

export default HomepageEndSection;
