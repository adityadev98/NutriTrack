import { Container, Flex, HStack, Text,Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";

import { useState } from "react";
import SignUpDialog from '../../Pages/SignUp'; // Import the Signup Dialog

const Navbar = () => {
  const [openSignUp, setOpenSignUp] = useState(false); // State to control the dialog

  return (
    <>
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
						Features
					</Link>
				</HStack>
				<HStack alignItems={"center"}>
					<Link to={"/"}>
						About Us
					</Link>
				</HStack>
				<HStack alignItems={"center"}>
					<Link to={"/sign-in"}>
						Sign In
					</Link>
				</HStack>
				<HStack alignItems={"center"}>
           		 <Button colorScheme="blue" onClick={() => setOpenSignUp(true)}>
              		Sign Up
            	</Button>
          		</HStack>
			</Flex>
		</Container>
		<SignUpDialog open={openSignUp} onClose={() => setOpenSignUp(false)} />
    </>
  );
};

export default Navbar;
