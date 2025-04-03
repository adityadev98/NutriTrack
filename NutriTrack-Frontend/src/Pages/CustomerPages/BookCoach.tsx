import { useEffect, useState, useContext } from "react";
import {
  Box,
  Heading,
  Text,
  Grid,
  Card,
  CardBody,
  Image,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Divider,
  SimpleGrid,
} from "@chakra-ui/react";
import axiosInstance from "../../utils/axiosInstance";
import { Sidenav } from "../../Components/Sections";
import { UserContext } from "../../contexts/UserContext";
import { coach_1, coach_2, coach_3, coach_4, coach_5 } from "@/assets";

interface Coach {
  _id: string;
  coachId: string;
  name: string;
  speciality: string;
  degree: string;
  experience: string;
  about: string;
  available: boolean;
  fees: number;
  address: {
    city: string;
    state?: string;
    zip: string;
  };
}

const coachImages = [coach_1, coach_2, coach_3, coach_4, coach_5];

const BookCoach = () => {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { loggedUser } = useContext(UserContext) ?? {};

  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        const res = await axiosInstance.get("/api/booking/list-coaches", {
          headers: {
            Authorization: `Bearer ${loggedUser?.token}`,
          },
        });
        setCoaches(res.data.coaches || []);
      } catch (err) {
        console.error("Error fetching coaches:", err);
      }
    };

    fetchCoaches();
  }, [loggedUser?.token]);

  const handleOpenModal = (coach: Coach) => {
    setSelectedCoach(coach);
    onOpen();
  };

  return (
    <Sidenav>
      <Box p={8}>
        {/* Section 1: Page Description */}
        <Box
          bg="white"
          boxShadow="md"
          borderRadius="lg"
          p={0}
          mb={10}
        >
          <Box
            bg="var(--dark-green)"
            borderTopRadius="lg"
            px={6}
            py={4}
          >
            <Heading size="lg" color="white">Book a Coach</Heading>
          </Box>
          <Box p={6} color="var(--dark-green)">
            <Text fontSize="md" fontWeight="medium">
              Explore our certified coaches to help you with your fitness and nutrition goals. Click "Book" to view more details and start your journey.
            </Text>
          </Box>
        </Box>

        {/* Section 2: Coach Cards Grid */}
        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={6}>
          {coaches.map((coach, index) => (
            <Card key={coach._id} boxShadow="md" borderRadius="md">
              <CardBody>
                <Image
                  src={coachImages[index % coachImages.length]}
                  alt={coach.name}
                  borderRadius="md"
                  objectFit="cover"
                  w="100%"
                  h="180px"
                />
                <Heading size="md" mt={4}>{coach.name}</Heading>
                <Text fontSize="sm" color="gray.500">{coach.speciality}</Text>

                <Button
                  mt={4}
                  size="sm"
                  colorScheme="blue"
                  onClick={() => handleOpenModal(coach)}
                >
                  Book
                </Button>
              </CardBody>
            </Card>
          ))}
        </Grid>

        {/* Modal for Coach Details */}
        <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
          <ModalOverlay />
          <ModalContent borderRadius="lg" py={6} px={4} bg="white">
            <ModalHeader fontSize="xl" fontWeight="bold" color="gray.700">
              {selectedCoach?.name}
            </ModalHeader>
            <ModalCloseButton color="gray.500" />
            <ModalBody>
              {selectedCoach && (
                <Box>
                  <Image
                    src={coachImages[coaches.findIndex(c => c._id === selectedCoach._id) % coachImages.length]}
                    alt={selectedCoach.name}
                    borderRadius="md"
                    objectFit="cover"
                    w="100%"
                    h="240px"
                    mb={4}
                  />

                  {/* Responsive Detail Grid with Dividers */}
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <Box>
                      <Text fontWeight="semibold">Speciality:</Text>
                      <Text>{selectedCoach.speciality}</Text>
                    </Box>
                    <Box>
                      <Text fontWeight="semibold">Experience:</Text>
                      <Text>{selectedCoach.experience}</Text>
                    </Box>
                    <Divider gridColumn={{ base: "1 / -1", md: "1 / -1" }} borderColor="gray.200" />
                    <Box>
                      <Text fontWeight="semibold">Degree:</Text>
                      <Text>{selectedCoach.degree}</Text>
                    </Box>
                    <Box>
                      <Text fontWeight="semibold">Fees:</Text>
                      <Text>${selectedCoach.fees}</Text>
                    </Box>
                    <Divider gridColumn={{ base: "1 / -1", md: "1 / -1" }} borderColor="gray.200" />
                    <Box>
                      <Text fontWeight="semibold">About:</Text>
                      <Text>{selectedCoach.about}</Text>
                    </Box>
                    <Box>
                      <Text fontWeight="semibold">Location:</Text>
                      <Text>{selectedCoach.address.city}, {selectedCoach.address.state || ""}</Text>
                    </Box>
                    <Divider gridColumn={{ base: "1 / -1", md: "1 / -1" }} borderColor="gray.200" />
                  </SimpleGrid>
                </Box>
              )}
            </ModalBody>
          </ModalContent>
        </Modal>
      </Box>
    </Sidenav>
  );
};

export default BookCoach;