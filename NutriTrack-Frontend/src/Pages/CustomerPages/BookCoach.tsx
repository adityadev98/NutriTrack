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
  Flex,
  SimpleGrid,
  useToast,
} from "@chakra-ui/react";
import axiosInstance from "../../utils/axiosInstance";
import { Sidenav } from "../../Components/Sections";
import { UserContext } from "../../contexts/UserContext";
import { coach_1, coach_2, coach_3, coach_4, coach_5 } from "@/assets";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../../styles/coachCalendar.css";

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
  slots_booked: Record<string, string[]>;
  address: {
    city: string;
    state?: string;
    zip: string;
  };
}

const coachImages = [coach_1, coach_2, coach_3, coach_4, coach_5];
const allSlots = [
  "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM",
  "05:00 PM", "06:00 PM", "07:00 PM", "08:00 PM", "09:00 PM"
];

const BookCoach = () => {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { loggedUser } = useContext(UserContext) ?? {};
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const toast = useToast();

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
  

  const handleOpenModal = (coach: Coach) => {
    setSelectedCoach(coach);
    setSelectedDate(null);
    setSelectedSlot(null);
    onOpen();
  };

  const handleBook = async () => {
    if (!selectedCoach || !selectedDate || !selectedSlot) {
      toast({
        title: "Please select a time slot.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
  
    try {
      const res = await axiosInstance.post(
        "/api/booking/book-appointment",
        {
          coachId: selectedCoach.coachId,
          slotDate: selectedDate.toISOString().split("T")[0],
          slotTime: selectedSlot,
        },
        {
          headers: {
            Authorization: `Bearer ${loggedUser?.token}`,
          },
        }
      );
  
      if (res.data.success) {
        toast({
          title: "Appointment booked! Redirecting to payment...",
          status: "success",
          duration: 2000,
          isClosable: true,
        });

        fetchCoaches();
          
        // Now get the payment Stripe URL
        const paymentRes = await axiosInstance.post(
          "/api/booking/payment-stripe",
          {
            appointmentId: res.data.appointmentId,
          },
          {
            headers: {
              Authorization: `Bearer ${loggedUser?.token}`,
            },
          }
        );
  
        if (paymentRes.data.session_url) {
            window.location.href = paymentRes.data.session_url;
          } else {
            toast({
              title: "Stripe payment URL missing.",
              status: "error",
              duration: 3000,
              isClosable: true,
            });
          }          
  
      } else {
        toast({
          title: res.data.message || "Failed to book appointment",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
  
    } catch (error) {
      console.error("Booking failed", error);
      toast({
        title: "Server error while booking",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };  

  const getAvailableSlots = (dateStr: string) => {
    if (!selectedCoach) return [];
    const booked = selectedCoach.slots_booked?.[dateStr] || [];
    return allSlots.filter((slot) => !booked.includes(slot));
  };

  const tileClassName = ({ date }: { date: Date }) => {
    if (!selectedCoach) return "";
    const dateStr = date.toISOString().split("T")[0];
    const booked = selectedCoach.slots_booked?.[dateStr] || [];
    const isSunday = date.getDay() === 0;

    if (isSunday || booked.length >= allSlots.length) {
      return "fully-booked";
    }
    return "available";
  };

  const tileDisabled = ({ date }: { date: Date }) => {
    if (!selectedCoach) return false;
    const dateStr = date.toISOString().split("T")[0];
    const booked = selectedCoach.slots_booked?.[dateStr] || [];
    const isSunday = date.getDay() === 0;
    return isSunday || booked.length >= allSlots.length;
  };

  return (
    <Sidenav>
      <Box p={8}>
        <Box bg="white" boxShadow="md" borderRadius="lg" p={0} mb={10}>
          <Box bg="var(--dark-green)" borderTopRadius="lg" px={6} py={4}>
            <Heading size="lg" color="white">Book a Coach</Heading>
          </Box>
          <Box p={6} color="var(--dark-green)">
            <Text fontSize="md" fontWeight="medium">
              Explore our certified coaches to help you with your fitness and nutrition goals. Click "Book" to view more details and start your journey.
            </Text>
          </Box>
        </Box>

        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={6}>
          {coaches.map((coach, index) => (
            <Card key={coach._id} boxShadow="md" borderRadius="md">
              <CardBody>
                <Image src={coachImages[index % coachImages.length]} alt={coach.name} borderRadius="md" objectFit="cover" objectPosition="top" w="100%" h="180px" />
                <Heading size="md" mt={4}>{coach.name}</Heading>
                <Text fontSize="sm" color="gray.500">{coach.speciality}</Text>
                <Button mt={4} size="sm" colorScheme="blue" onClick={() => handleOpenModal(coach)}>Book</Button>
              </CardBody>
            </Card>
          ))}
        </Grid>

        <Modal isOpen={isOpen} onClose={onClose} isCentered size="4xl">
          <ModalOverlay />
          <ModalContent borderRadius="lg" py={6} px={4} bg="white">
            <ModalHeader fontSize="xl" fontWeight="bold" color="gray.700">{selectedCoach?.name}</ModalHeader>
            <ModalCloseButton color="gray.500" />
            <ModalBody>
              {selectedCoach && (
                <Box>
                  <Image src={coachImages[coaches.findIndex(c => c._id === selectedCoach._id) % coachImages.length]} alt={selectedCoach.name} borderRadius="md" objectFit="cover" objectPosition="top" w="100%" h="240px" mb={4} />

                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={6}>
                    <Box><Text fontWeight="semibold">Speciality:</Text><Text>{selectedCoach.speciality}</Text></Box>
                    <Box><Text fontWeight="semibold">Experience:</Text><Text>{selectedCoach.experience}</Text></Box>
                    <Divider gridColumn="1 / -1" borderColor="gray.200" />
                    <Box><Text fontWeight="semibold">Degree:</Text><Text>{selectedCoach.degree}</Text></Box>
                    <Box><Text fontWeight="semibold">Fees:</Text><Text>${selectedCoach.fees}</Text></Box>
                    <Divider gridColumn="1 / -1" borderColor="gray.200" />
                    <Box><Text fontWeight="semibold">About:</Text><Text>{selectedCoach.about}</Text></Box>
                    <Box><Text fontWeight="semibold">Location:</Text><Text>{selectedCoach.address.city}, {selectedCoach.address.state || ""}</Text></Box>
                    <Divider gridColumn="1 / -1" borderColor="gray.200" />
                  </SimpleGrid>

                  <Flex gap={6} direction={{ base: "column", md: "row" }}>
                    <Box>
                      <Text fontWeight="bold" mb={2}>Select Date</Text>
                      <Calendar
                        onChange={(val) => setSelectedDate(val as Date)}
                        tileClassName={tileClassName}
                        tileDisabled={tileDisabled}
                        minDate={new Date()}
                        prev2Label={null}
                        next2Label={null}
                        nextLabel={">"}
                        prevLabel="<"
                        calendarType="gregory"
                        navigationLabel={({ date }) => `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`}
                      />
                    </Box>
                    <Box flex={1}>
                      {selectedDate && (
                        <>
                          <Text fontWeight="bold" mb={2}>Available Slots for {selectedDate.toDateString()}</Text>
                          <Flex wrap="wrap" gap={2}>
                            {getAvailableSlots(selectedDate.toISOString().split("T")[0]).map((slot) => (
                              <Button
                                key={slot}
                                size="sm"
                                variant={selectedSlot === slot ? "solid" : "outline"}
                                colorScheme="green"
                                onClick={() => setSelectedSlot(slot)}
                                backgroundColor={selectedSlot === slot ? "var(--dark-green)" : undefined}
                              >
                                {slot}
                              </Button>
                            ))}
                          </Flex>
                          {selectedSlot && (
                            <Button mt={6} colorScheme="green" bg="var(--dark-green)" onClick={handleBook}>Confirm Booking</Button>
                          )}
                        </>
                      )}
                    </Box>
                  </Flex>
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
