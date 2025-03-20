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
    <Flex width={'100%'} maxW={'100%'}  bg={'var(--soft-white)'} minH={"50vh"} border="2px solid red" p={0}>
      <Box as={Container} maxW="7xl" p={4} border="2px solid blue">
        <Grid
          templateColumns={{
            base: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(4, 1fr)',
          }}
          gap={{ base: '8', sm: '12', md: '16' }}>
          <Feature
            heading={'First Feature'}
            text={'Customized meal plans and recipes, tailored to your needs and preferences'}
          />
          <Feature
            heading={'Second Feature'}
            text={'Track your daily nutrition intake and monitor your progress'}
          />
          <Feature
            heading={'Third Feature'}
            text={'Profile setup to help us understand your needs and preferences'}
          />
          <Feature
            heading={'Fourth Feature'}
            text={'Connect with a community of like-minded individuals and share your journey'}
          />
        </Grid>
      </Box>
    </Flex>
  )
}