import {Navbar, Footer, Hero, HomepageMidSection1} from "../Components/Sections";
import { Box} from "@chakra-ui/react";
//import styles from "../../style";

const HomePage = () => {
	
	return (
		<Box className="w-full min-h-screen flex flex-col">
      
			{/* ✅ Fixed Navbar */}
			<Box className="fixed top-0 left-0 w-full z-50 bg-navbar">
				<Navbar />
			</Box>
	
			{/* ✅ Ensures content starts below the navbar */}
			<Box className="flex-grow pt-[80px] bg-primary">  
				<Hero />
			</Box>
			<Box className="flex-grow pt-[80px] bg-primary">  
				<HomepageMidSection1 />
			</Box>
	
			{/* ✅ Footer stays at bottom */}
			<Box className="w-full mt-auto bg-footer">
				<Footer />
			</Box>
		</Box>
	);
};
export default HomePage;