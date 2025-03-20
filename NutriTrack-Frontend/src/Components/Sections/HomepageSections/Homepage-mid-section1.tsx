 'use client'

import {
  Box,
  chakra,
  Grid,
  GridItem,
  Container,
  Flex,
} from '@chakra-ui/react'

interface FeatureProps {
  heading: string
  text: string
}

const Feature = ({ heading, text }: FeatureProps) => {
  return (
    <GridItem>
      <chakra.h3 fontSize="xl" fontWeight="600">
        {heading}
      </chakra.h3>
      <chakra.p>{text}</chakra.p>
    </GridItem>
  )
}

export default function HomepageMidSection1() {
  return (
    <Flex width={'100%'} maxW={'100%'} bg={'var(--soft-white)'} minH={"50vh"} p={0}>
      <Box as={Container} maxW="7xl" p={4}>
        <Grid
          templateColumns={{
            base: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(4, 1fr)',
          }}
          gap={{ base: '8', sm: '12', md: '16' }}>
          <Feature
            heading={'Personalized Meal Plans'}
            text={'Get customized meal plans and recipes tailored to your dietary needs, preferences, and goals.'}
          />
          <Feature
            heading={'Nutrition Tracking'}
            text={'Track your daily calorie, protein, and nutrient intake to stay on top of your health goals.'}
          />
          <Feature
            heading={'Profile Setup'}
            text={'Set up your profile to calculate your daily calorie and protein needs based on your age, weight, height, and activity level.'}
          />
          <Feature
            heading={'Community Support'}
            text={'Join a community of like-minded individuals to share your journey, tips, and progress.'}
          />
          <Feature
            heading={'Custom Food Tracking'}
            text={'Add and track custom foods that are not available in the standard database.'}
          />
          <Feature
            heading={'Historical Data'}
            text={'View your historical progress, including meals consumed, activity levels, and weight changes over time.'}
          />
          <Feature
            heading={'Hydration Tracker'}
            text={'Monitor your daily water intake to ensure you stay hydrated and healthy.'}
          />
          <Feature
            heading={'Dashboard Insights'}
            text={'Access a comprehensive dashboard with insights into your daily calorie needs, BMI, and protein requirements.'}
          />
        </Grid>
      </Box>
    </Flex>
  )
}