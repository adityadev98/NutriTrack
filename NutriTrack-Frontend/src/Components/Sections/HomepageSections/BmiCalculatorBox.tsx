import { useState } from 'react';
import {
  Box,
  Heading,
  Text,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Flex,
  Stack,
} from '@chakra-ui/react';

const BmiCalculatorBox = () => {
  const [height, setHeight] = useState(170); // cm
  const [weight, setWeight] = useState(70); // kg

  const heightInMeters = height / 100;
  const bmi = Number((weight / (heightInMeters * heightInMeters)).toFixed(1));

  const getBmiFeedback = (bmi: number) => {
    if (bmi < 18.5) return 'You are underweight. Consider a balanced diet.';
    if (bmi >= 18.5 && bmi < 25) return 'Great going! You are in a healthy BMI range.';
    if (bmi >= 25 && bmi < 30) return 'You are overweight. Consider some lifestyle changes.';
    return 'You are in the obese category. Please consult a health professional.';
  };

  return (
    <>
    <Box bg="var(--bright-green)" w="full" py={6}>
        <Heading
            as="h2"
            fontSize={{ base: "clamp(4rem, 10vw, 5rem)" }}
            textAlign="center"
            fontFamily={"Deacon, sans-serif"}
            fontWeight={800}
            color="var(--dark-green)"
            letterSpacing="wide"
        >
            CHECK YOUR BMI
        </Heading>
    </Box>
    <Box bg="var(--dark-green)" color="white" px={8} py={20} boxShadow="md">
      <Flex direction={{ base: 'column', md: 'row' }} gap={12}>
        {/* Left Side - Sliders */}
        <Box flex={1}>
          <Stack spacing={6}>
            <Box>
              <Heading fontSize="4xl" color="var(--bright-green)">Height (cm)</Heading>
              <Text mt={1} fontSize="2xl" >{height} cm</Text>
              <Slider
                min={100}
                max={220}
                value={height}
                onChange={setHeight}
                colorScheme="green"
                size="lg"
              >
                <SliderTrack h="8px">
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb boxSize={6} />
              </Slider>
            </Box>

            <Box>
              <Heading fontSize="4xl" color="var(--bright-green)">Weight (kg)</Heading>
              <Text mt={1} fontSize="2xl">{weight} kg</Text>
              <Slider
                min={30}
                max={150}
                value={weight}
                onChange={setWeight}
                colorScheme="green"
                size="lg"
              >
                <SliderTrack h="8px">
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb boxSize={6} />
              </Slider>
            </Box>
          </Stack>
        </Box>

        {/* Right Side - BMI Display */}
        <Box flex={1} pt={6} pl={8}>
          <Heading fontSize="4xl" color="var(--bright-green)" mb={4}>Your BMI</Heading>
          <Text fontSize="7xl" fontWeight="bold" mb={2}>{bmi}</Text>
          <Text fontSize="2xl">{getBmiFeedback(bmi)}</Text>
        </Box>
      </Flex>
    </Box>
    </>
  );
};

export default BmiCalculatorBox;
