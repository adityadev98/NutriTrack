import {Navbar, Footer} from "../Components/Sections";
import { Box} from "@chakra-ui/react";
//import styles from "../../style";

const ContactUs = () => {
  
  return (
    <Box className="w-full min-h-screen flex flex-col">
      
      {/* ✅ Fixed Navbar */}
      <Box className="fixed top-0 left-0 w-full z-50 bg-navbar">
        <Navbar />
      </Box>
  
      {/* ✅ Ensures content starts below the navbar */}
      <Box className="flex-grow pt-[80px] bg-alternate">  
          Put the Contents Here
      </Box>
  
      {/* ✅ Footer stays at bottom */}
      <Box className="w-full mt-auto bg-footer">
        <Footer />
      </Box>
    </Box>
  );
};
export default ContactUs;
