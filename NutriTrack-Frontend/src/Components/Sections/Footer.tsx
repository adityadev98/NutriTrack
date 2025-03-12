
import {
  Box,
  //Container,
  SimpleGrid,
  Stack,
  Text,
  //useColorModeValue,
  Button,
  Divider,
  Link,
} from '@chakra-ui/react'
import { FaLinkedin, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { sm_logo } from "../../assets/index.ts";
import {footerLinks } from "../../Constants";

const Logo = () => {
  return (
    <a href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
      <img src={sm_logo} alt="NutriTrack" className="w-[80px] h-[40px]" />
    </a>
  );
};


export default function Footer() {
  const linkColor = "var(--soft-white)";
  const linkHoverColor = 'white';

  return (
    <Box
      bg={'--dark-green'}
      color={'gray.200'}
      width={'100vw'}
      >
      {/* <Container as={Stack} maxW={'6xl'} py={10}> */}
      <Stack maxW="100%" py={10} px={8}>
        <SimpleGrid
          templateColumns={{ sm: '1fr 1fr', md: '1fr 1fr', xl: '2fr 2fr 1fr 1fr' }}
          spacing={8}>
          <Stack flex="1" spacing={6} direction="row" >
            <Box>
              <Logo />
            </Box>
            <Box pt={6}>
            <Text fontSize="24px" fontWeight="400" color="#F3EDE4" fontFamily="Rubik, sans-serif">
              Get in touch
            </Text>
            <Link 
              href="mailto:hello@mailgun.onixpace.com" 
              fontSize="24px" 
              fontWeight="400" 
              color="#F3EDE4" 
              fontFamily="Graphik, sans-serif"
              textDecoration="underline" 
              _hover={{ textDecoration: "none" }} 
            >
              hello@mailgun.onixpace.com
            </Link>
           </Box>
          </Stack>
          <Stack flex="1" display={{ base: 'none', xl: 'flex' }}/>
          <Stack flex="1" spacing={2} color="var(--off-white)">
            <Text fontSize="sm" fontWeight="bold">
              2025 NutriTrack Ltd
            </Text>
            <Text fontSize="sm">ECE 651 - Project </Text>
            <Text fontSize="sm">
              Street No. 1, XYZ Building, 101 University Avenue, Waterloo, N2J XXX
            </Text>
          </Stack>
          <Stack align={'flex-start'} justify={'flex-end'}>
            {footerLinks.map((nav) =>{
            return (
              <a key={nav.id} href={`/${nav.id}`} style={{ textDecoration: 'none' }}> 
                  <Box 
                    fontFamily={'Rubik, sans-serif'} 
                    color={linkColor}
                    _hover={{
                      textDecoration: 'none',
                      color: linkHoverColor,
                    }}
                    fontSize="md"
                    justifyContent="center"  
                    alignItems="center"
                    textAlign="center"  
                    width="100%" 
                  >
                    {nav.title}
                </Box>
              </a>
            );
          })}
             
            <Stack
              flex="1"
              justify={'flex-end'}
              direction={'row'}
              spacing={6}>
              
              {/* LinkedIn Button */}
              <Button
                as={'a'}
                href="#"
                fontSize={'14px'}
                fontFamily={'Rubik, sans-serif'}
                fontWeight={400}
                bg={'var(--dark-green)'} // Background color
                color={'var(--soft-white)'} // Text color
                border={'2px solid var(--soft-white)'} // Border color
                px={'16px'}
                py={'9px'}
                borderRadius={'50px'} // Oval shape
                tabIndex={0} // Enables keyboard focusability
                role="link" // Explicitly sets the role as a link
                aria-label="LinkedIn" // Screen reader label
                _hover={{
                  bg: 'rgba(25, 50, 25, 0.8)', // Slightly darker version of --dark-green
                }}
                _focus={{
                  outline: "2px solid var(--bright-green)", // Focus visibility
                  outlineOffset: "2px",
                }}
              >
                <FaLinkedin size={20} /> {/* LinkedIn Icon */}
              </Button>

              {/* Instagram Button */}
              <Button
                as={'a'}
                href="#"
                fontSize={'14px'}
                fontFamily={'Rubik, sans-serif'}
                fontWeight={400}
                bg={'var(--dark-green)'} // Background color
                color={'var(--soft-white)'} // Text color
                border={'2px solid var(--soft-white)'} // Border color
                px={'16px'}
                py={'9px'}
                borderRadius={'50px'} // Oval shape
                tabIndex={0} // Enables keyboard focusability
                role="link" // Explicitly sets the role as a link
                aria-label="Instagram" // Screen reader label
                _hover={{
                  bg: 'rgba(25, 50, 25, 0.8)', // Slightly darker version of --dark-green
                }}
                _focus={{
                  outline: "2px solid var(--bright-green)", // Focus visibility
                  outlineOffset: "2px",
                }}
              >
                <FaInstagram size={20} /> {/* Instagram Icon */}
              </Button>
              {/* X (Twitter) Button */}
              <Button
                  as={'a'}
                  href="#"
                  fontSize={'14px'}
                  fontFamily={'Rubik, sans-serif'}
                  fontWeight={400}
                  bg={'var(--dark-green)'} // Background color
                  color={'var(--soft-white)'} // Text color
                  border={'2px solid var(--soft-white)'} // Border color
                  px={'16px'}
                  py={'9px'}
                  borderRadius={'50px'} // Oval shape
                  tabIndex={0} // Enables keyboard focusability
                  role="link" // Explicitly sets the role as a link
                  aria-label="X (Twitter)" // Screen reader label
                  _hover={{
                    bg: 'rgba(25, 50, 25, 0.8)', // Slightly darker version of --dark-green
                  }}
                  _focus={{
                    outline: "2px solid var(--bright-green)", // Focus visibility
                    outlineOffset: "2px",
                  }}
                >
                  <FaXTwitter size={20} /> {/* X (Twitter) Icon */}
                </Button>
            </Stack>
          </Stack>

        </SimpleGrid>
      </Stack>
      {/* </Container> */}
      <Divider borderColor="rgb(87, 94, 89)" />
      <Text fontSize="sm"  mt={2} px={8} color={'var(--footer-color)'} pt={8} pb={5}>
        <Text fontSize={'sm'}>© 2025 NutriTrack Ltd. All rights reserved</Text>
        <Text as="span" fontWeight="bold">NutriTrack Limited</Text> is a project developed for ECE 651 by Group 3 during the Winter 2025 term.
      </Text>
    </Box>
  )
}