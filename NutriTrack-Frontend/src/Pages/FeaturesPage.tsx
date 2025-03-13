import {Navbar, Footer} from "../Components/Sections";
import {
	Box,
	Container,
	Heading,
	SimpleGrid,
	Icon,
	Text,
	Stack,
	HStack,
	VStack,
  } from '@chakra-ui/react'
  import { CheckIcon } from '@chakra-ui/icons'
//import styles from "../../style";
import {FeaturesList} from "../Constants";

const features = FeaturesList;

const Features = () => {
	
	return (
		<Box className="w-full min-h-screen flex flex-col">
      
			{/* ✅ Fixed Navbar */}
			<Box className="fixed top-0 left-0 w-full z-50 bg-navbar">
				<Navbar />
			</Box>
	
			{/* ✅ Ensures content starts below the navbar */}
			<Box className="flex-grow pt-[80px]">  
			<Box p={4} pt={50} pb={50}>
				<Stack spacing={4} as={Container} maxW={'3xl'} textAlign={'center'}>
					<Heading fontSize={'3xl'}>NutriTrack Features</Heading>
					<Text color={'gray.600'} fontSize={'xl'}>
					Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod
					tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.
					</Text>
				</Stack>

				<Container maxW={'6xl'} mt={10}>
					<SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={10}>
					{features.map((feature) => (
						<HStack key={feature.id} align={'top'}>
						<Box color={'green.400'} px={2}>
							<Icon as={CheckIcon} />
						</Box>
						<VStack align={'start'}>
							<Text fontWeight={600}>{feature.title}</Text>
							<Text color={'gray.600'}>{feature.text}</Text>
						</VStack>
						</HStack>
					))}
					</SimpleGrid>
				</Container>
				</Box>
			</Box>
	
			{/* ✅ Footer stays at bottom */}
			<Box className="w-full mt-auto bg-footer">
				<Footer />
			</Box>
		</Box>
	);
};
export default Features;