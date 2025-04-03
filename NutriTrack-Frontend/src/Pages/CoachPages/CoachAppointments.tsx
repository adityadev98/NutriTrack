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
import { CoachNav } from "../../Components/Sections";
import axiosInstance from "../../utils/axiosInstance";
import { UserContext } from "../../contexts/UserContext";

interface Appointment {
  _id: string;
  coachId: string;
  slotDate: string;
  slotTime: string;
  cancelled: boolean;
  payment: boolean;
  isCompleted: boolean;
  userData: {
    name: string;
    email: string;
  };
}

const CoachAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCancelled, setShowCancelled] = useState(false);
  const { loggedUser } = useContext(UserContext) ?? {};
  const toast = useToast();
  const {
    isOpen: isCancelOpen,
    onOpen: onCancelOpen,
    onClose: onCancelClose,
  } = useDisclosure();
  const {
    isOpen: isCompleteOpen,
    onOpen: onCompleteOpen,
    onClose: onCompleteClose,
  } = useDisclosure();
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);

  const fetchAppointments = async () => {
    try {
      const res = await axiosInstance.get("/api/coach/appointments", {
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
        "/api/coach/cancel-appointment",
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
      onCancelClose();
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

  const handleComplete = async () => {
    if (!selectedAppointmentId) return;
    try {
      await axiosInstance.post(
        "/api/coach/complete-appointment",
        { appointmentId: selectedAppointmentId },
        {
          headers: {
            Authorization: `Bearer ${loggedUser?.token}`,
          },
        }
      );
      toast({
        title: "Appointment marked as completed",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onCompleteClose();
      fetchAppointments();
    } catch (err) {
      toast({
        title: "Failed to complete appointment",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const activeAppointments = appointments.filter(appt => !appt.cancelled);
  const cancelledAppointments = appointments.filter(appt => appt.cancelled);

  return (
    <CoachNav>
      <Box p={8}>
        <Box bg="white" boxShadow="md" borderRadius="lg" p={0} mb={10}>
          <Box bg="var(--dark-green)" borderTopRadius="lg" px={6} py={4}>
            <Heading size="lg" color="white">Coach Appointments</Heading>
          </Box>
          <Box p={6} color="var(--dark-green)">
            <Text fontSize="md" fontWeight="medium">
              View and manage all your upcoming appointments with clients.
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
                    <Th>Client Name</Th>
                    <Th>Date</Th>
                    <Th>Time</Th>
                    <Th>Payment</Th>
                    <Th>Completed</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {activeAppointments.map((appt, index) => (
                    <Tr key={appt._id}>
                      <Td>{index + 1}</Td>
                      <Td>{appt.userData?.email}</Td>
                      <Td>{appt.slotDate}</Td>
                      <Td>{appt.slotTime}</Td>
                      <Td>
                        <Icon
                          as={appt.payment ? CheckCircleIcon : CloseIcon}
                          color={appt.payment ? "green.500" : "red.500"}
                        />
                      </Td>
                      <Td>
                        <Icon
                          as={appt.isCompleted ? CheckCircleIcon : CloseIcon}
                          color={appt.isCompleted ? "green.500" : "red.500"}
                        />
                      </Td>
                      <Td>
                        {!appt.isCompleted && (
                          <Flex gap={2}>
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedAppointmentId(appt._id);
                                onCompleteOpen();
                              }}
                            >
                              Complete Appointment
                            </Button>
                            <Button
                              size="sm"
                              leftIcon={<MdEdit />}
                              onClick={() => {
                                setSelectedAppointmentId(appt._id);
                                onCancelOpen();
                              }}
                            >
                              Cancel Appointment
                            </Button>
                          </Flex>
                        )}
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
                        <Th>Client Name</Th>
                        <Th>Date</Th>
                        <Th>Time</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {cancelledAppointments.map((appt, index) => (
                        <Tr key={appt._id}>
                          <Td>{index + 1}</Td>
                          <Td>{appt.userData?.email}</Td>
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

        <Modal isOpen={isCancelOpen} onClose={onCancelClose} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Cancel Appointment</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              Are you sure you want to cancel this appointment?
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onCancelClose}>
                No
              </Button>
              <Button colorScheme="red" onClick={handleCancel}>
                Yes
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <Modal isOpen={isCompleteOpen} onClose={onCompleteClose} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Complete Appointment</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              Are you sure you want to mark this appointment as completed?
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onCompleteClose}>
                No
              </Button>
              <Button colorScheme="green" onClick={handleComplete}>
                Yes
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </CoachNav>
  );
};

export default CoachAppointments;
