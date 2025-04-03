import { useEffect, useState, useContext } from "react";
import {
  Box,
  Heading,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Icon,
  Spinner,
  useToast,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  Flex,
} from "@chakra-ui/react";
import { CheckCircleIcon, CloseIcon } from "@chakra-ui/icons";
import { MdEdit } from "react-icons/md";
import { Sidenav } from "../../Components/Sections";
import axiosInstance from "../../utils/axiosInstance";
import { UserContext } from "../../contexts/UserContext";

type Appointment = {
  _id: string;
  coachId: string;
  slotDate: string;
  slotTime: string;
  payment: boolean;
  cancelled: boolean;
  coachData: {
    name: string;
  };
};

const Appointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCancelled, setShowCancelled] = useState(false);
  const { loggedUser } = useContext(UserContext) ?? {};
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);

  const fetchAppointments = async () => {
    try {
      const res = await axiosInstance.get("/api/booking/appointments", {
        headers: {
          Authorization: `Bearer ${loggedUser?.token}`,
        },
      });
      setAppointments(res.data.appointments || []);
    } catch (err) {
      toast({
        title: "Error loading appointments",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [loggedUser?.token]);

  const handleCancel = async () => {
    if (!selectedAppointmentId) return;
    try {
      await axiosInstance.post(
        "/api/booking/cancel-appointment",
        { appointmentId: selectedAppointmentId },
        {
          headers: {
            Authorization: `Bearer ${loggedUser?.token}`,
          },
        }
      );
      toast({
        title: "Appointment cancelled",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose();
      fetchAppointments();
    } catch (err) {
      toast({
        title: "Failed to cancel appointment",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleRetryPayment = async (appointmentId: string) => {
    try {
      const res = await axiosInstance.post(
        "/api/booking/payment-stripe",
        { appointmentId },
        {
          headers: {
            Authorization: `Bearer ${loggedUser?.token}`,
          },
        }
      );
      if (res.data.session_url) {
        window.location.href = res.data.session_url;
      } else {
        toast({
          title: "Stripe payment URL missing.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Payment retry failed",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const activeAppointments = appointments.filter(appt => !appt.cancelled);
  const cancelledAppointments = appointments.filter(appt => appt.cancelled);

  return (
    <Sidenav>
      <Box p={8}>
        <Box bg="white" boxShadow="md" borderRadius="lg" p={0} mb={10}>
          <Box bg="var(--dark-green)" borderTopRadius="lg" px={6} py={4}>
            <Heading size="lg" color="white">Appointments</Heading>
          </Box>
          <Box p={6} color="var(--dark-green)">
            <Text fontSize="md" fontWeight="medium">
              View and manage your scheduled appointments with certified coaches.
            </Text>
          </Box>
        </Box>

        <Box bg="white" boxShadow="md" borderRadius="lg" p={6}>
          {loading ? (
            <Spinner size="lg" />
          ) : (
            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>#</Th>
                    <Th>Coach Name</Th>
                    <Th>Date</Th>
                    <Th>Time</Th>
                    <Th>Payment</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {activeAppointments.map((appt, index) => (
                    <Tr key={appt._id}>
                      <Td>{index + 1}</Td>
                      <Td>{appt.coachData?.name}</Td>
                      <Td>{appt.slotDate}</Td>
                      <Td>{appt.slotTime}</Td>
                      <Td>
                        <Flex align="center" gap={2}>
                          <Icon
                            as={appt.payment ? CheckCircleIcon : CloseIcon}
                            color={appt.payment ? "green.500" : "red.500"}
                          />
                          {!appt.payment && (
                            <Button size="sm" onClick={() => handleRetryPayment(appt._id)}>
                              Retry Payment
                            </Button>
                          )}
                        </Flex>
                      </Td>
                      <Td>
                        <Button
                          size="sm"
                          leftIcon={<MdEdit />}
                          onClick={() => {
                            setSelectedAppointmentId(appt._id);
                            onOpen();
                          }}
                        >
                          Cancel Appointment
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          )}
        </Box>

        {cancelledAppointments.length > 0 && (
          <Box mt={6}>
            <Button onClick={() => setShowCancelled(!showCancelled)}>
              {showCancelled ? "Hide Cancelled Appointments" : "Show Cancelled Appointments"}
            </Button>

            {showCancelled && (
              <Box mt={4} bg="white" boxShadow="md" borderRadius="lg" p={6}>
                <TableContainer>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>#</Th>
                        <Th>Coach Name</Th>
                        <Th>Date</Th>
                        <Th>Time</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {cancelledAppointments.map((appt, index) => (
                        <Tr key={appt._id}>
                          <Td>{index + 1}</Td>
                          <Td>{appt.coachData?.name}</Td>
                          <Td>{appt.slotDate}</Td>
                          <Td>{appt.slotTime}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </Box>
            )}
          </Box>
        )}

        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Cancel Appointment</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              Are you sure you want to cancel this appointment?
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                No
              </Button>
              <Button colorScheme="red" onClick={handleCancel}>
                Yes
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </Sidenav>
  );
};

export default Appointments;
