import { Container, Flex, HStack, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const Navbar = () => {
		return (
		<Container maxW={"7xl"} py={4}>
			<Flex
				h={16}
				alignItems={"center"}
				justifyContent={"space-between"}
				flexDir={{
					base: "column",
					sm: "row",
				}}
			>
				<Text
				
					fontSize={{ base: "22", sm: "28" }}
					fontWeight={"bold"}
					textTransform={"uppercase"}
					textAlign={"center"}
					bgGradient={"linear(to-r, cyan.400, blue.500)"}
					bgClip={"text"}
				>
					<Link to={"/"}>Home Page</Link>
				</Text>

				<HStack alignItems={"center"}>
					<Link to={"/"}>
						Page 2
					</Link>
				</HStack>
			</Flex>
		</Container>
	);
};
export default Navbar;