'use client'

import {
  Box,
  chakra,
  Grid,
  GridItem,
  Container,
  Flex,
  Icon,
  Heading,
} from '@chakra-ui/react'
import {
  MdFastfood,
  MdOutlineTrackChanges,
  MdPerson,
  MdGroup,
  MdPlaylistAdd,
  MdTimeline,
  MdWaterDrop,
  MdDashboard,
} from 'react-icons/md'

import { IconType } from 'react-icons';

interface FeatureProps {
  heading: string;
  text: string;
  icon: IconType;
}

const Feature = ({ heading, text, icon }: FeatureProps) => {
  return (
    <GridItem textAlign="center">
      <Flex
        justify="center"
        align="center"
        bg="var(--dark-green)"
        borderRadius="full"
        w={16}
        h={16}
        mb={4}
        mx="auto" // center the icon
      >
        <Icon as={icon} w={8} h={8} color="white" />
      </Flex>
      <chakra.h3 fontSize="xl" fontWeight="600" mb={2}>
        {heading}
      </chakra.h3>
      <chakra.p fontSize="md" color="gray.600">
        {text}
      </chakra.p>
    </GridItem>
  )
}

export default function HomepageMidSection1() {
  return (
    <>
    <Box bg="yellow.400" w="full" py={6}>
        <Heading
            as="h2"
            fontSize={{ base: "clamp(4rem, 10vw, 6rem)" }}
            textAlign="center"
            fontFamily={"Deacon, sans-serif"}
            fontWeight={800}
            color="var(--dark-green)"
            letterSpacing="wide"
        >
            FEATURES
        </Heading>
    </Box>


    <Flex width="100%" bg="#FFF9DB"  py={12}>
      <Box as={Container} maxW="7xl" px={6}>
        <Grid
          templateColumns={{
            base: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(4, 1fr)',
          }}
          gap={{ base: 10, sm: 12, md: 16 }}>
          <Feature
            icon={MdFastfood}
            heading={'Personalized Meal Plans'}
            text={'Get customized meal plans and recipes tailored to your dietary needs, preferences, and goals.'}
          />
          <Feature
            icon={MdOutlineTrackChanges}
            heading={'Nutrition Tracking'}
            text={'Track your daily calorie, protein, and nutrient intake to stay on top of your health goals.'}
          />
          <Feature
            icon={MdPerson}
            heading={'Profile Setup'}
            text={'Set up your profile to calculate your daily calorie and protein needs based on your age, weight, height, and activity level.'}
          />
          <Feature
            icon={MdGroup}
            heading={'Community Support'}
            text={'Join a community of like-minded individuals to share your journey, tips, and progress.'}
          />
          <Feature
            icon={MdPlaylistAdd}
            heading={'Custom Food Tracking'}
            text={'Add and track custom foods that are not available in the standard database.'}
          />
          <Feature
            icon={MdTimeline}
            heading={'Historical Data'}
            text={'View your historical progress, including meals consumed, activity levels, and weight changes over time.'}
          />
          <Feature
            icon={MdWaterDrop}
            heading={'Hydration Tracker'}
            text={'Monitor your daily water intake to ensure you stay hydrated and healthy.'}
          />
          <Feature
            icon={MdDashboard}
            heading={'Dashboard Insights'}
            text={'Access a comprehensive dashboard with insights into your daily calorie needs, BMI, and protein requirements.'}
          />
        </Grid>
      </Box>
    </Flex>
    </>
  )
}
