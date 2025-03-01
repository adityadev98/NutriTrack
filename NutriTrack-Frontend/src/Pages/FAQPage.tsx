import {Navbar, Footer} from "../Components/Sections";
import {
	Accordion,
	AccordionItem,
	AccordionButton,
	AccordionPanel,
	Flex,
	useColorModeValue,
	Text,
	Container,
	Box,
  } from '@chakra-ui/react'
  
  import { ChevronDownIcon } from '@chakra-ui/icons'
//import styles from "../../style";

const FAQ = () => {
	
	return (
		<Box className="w-full min-h-screen flex flex-col">
      
			{/* ✅ Fixed Navbar */}
			<Box className="fixed top-0 left-0 w-full z-50 bg-navbar">
				<Navbar />
			</Box>
	
			{/* ✅ Ensures content starts below the navbar */}
			<Box className="flex-grow pt-[80px] bg-primary">  
			<Flex
				minH={'50vh'}
				align={'center'}
				justify={'center'}>
				<Container>
					<Accordion allowMultiple width="100%" maxW="lg" rounded="lg">
					<AccordionItem>
						<AccordionButton
						display="flex"
						alignItems="center"
						justifyContent="space-between"
						p={4}>
						<Text fontSize="md">What is Chakra UI?</Text>
						<ChevronDownIcon fontSize="24px" />
						</AccordionButton>
						<AccordionPanel pb={4}>
						<Text color="gray.600">
							Chakra UI is a simple and modular component library that gives developers
							the building blocks they need to create web applications.
						</Text>
						</AccordionPanel>
					</AccordionItem>
					<AccordionItem>
						<AccordionButton
						display="flex"
						alignItems="center"
						justifyContent="space-between"
						p={4}>
						<Text fontSize="md">What advantages to use?</Text>
						<ChevronDownIcon fontSize="24px" />
						</AccordionButton>
						<AccordionPanel pb={4}>
						<Text color="gray.600">
							Chakra UI offers a variety of advantages including ease of use,
							accessibility, and customization options. It also provides a comprehensive
							set of UI components and is fully compatible with React.
						</Text>
						</AccordionPanel>
					</AccordionItem>
					<AccordionItem>
						<AccordionButton
						display="flex"
						alignItems="center"
						justifyContent="space-between"
						p={4}>
						<Text fontSize="md">How to start using Chakra UI?</Text>
						<ChevronDownIcon fontSize="24px" />
						</AccordionButton>
						<AccordionPanel pb={4}>
						<Text color="gray.600">
							To get started with Chakra UI, you can install it via npm or yarn, and
							then import the components you need in your project. The Chakra UI
							documentation is also a great resource for getting started and learning
							more about the library.
						</Text>
						</AccordionPanel>
					</AccordionItem>
					</Accordion>
				</Container>
				</Flex>
			</Box>
	
			{/* ✅ Footer stays at bottom */}
			<Box className="w-full mt-auto bg-footer">
				<Footer />
			</Box>
		</Box>
	);
};
export default FAQ;