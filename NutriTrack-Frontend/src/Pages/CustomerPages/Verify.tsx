import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axiosInstance from "@/utils/axiosInstance";
import { useToast } from "@chakra-ui/react";

const Verify = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const verifyPayment = async () => {
      const appointmentId = searchParams.get("appointmentId");
      const success = searchParams.get("success");

      if (!appointmentId) {
        navigate("/appointments");
        return;
      }

      if (success === "true") {
        try {
          const res = await axiosInstance.post("/api/booking/verifyStripe", {
            appointmentId,
            success,
          });

          if (res.data.success) {
            toast({
              title: "Payment verified successfully!",
              status: "success",
              duration: 3000,
              isClosable: true,
            });
          } else {
            toast({
              title: res.data.message || "Payment verification failed",
              status: "error",
              duration: 3000,
              isClosable: true,
            });
          }
        } catch (err) {
          console.error("Error verifying payment:", err);
          toast({
            title: "Server error during verification",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      }

      // ✅ Redirect regardless
      setTimeout(() => {
        navigate("/appointments");
      }, 1500);
    };

    verifyPayment();
  }, [navigate, searchParams, toast]);

  return null; // or a loader/spinner if you want
};

export default Verify;
