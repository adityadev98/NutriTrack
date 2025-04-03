import express from 'express';
import { bookAppointment, listAppointment, listAvailableCoaches , cancelAppointment, paymentStripe, verifyStripe } from '../controllers/userController.js';
import { authMiddleware } from "../middleware/authMiddleware.js";

const userRouter = express.Router();

userRouter.post("/book-appointment", authMiddleware, bookAppointment)
userRouter.get("/appointments", authMiddleware, listAppointment)
userRouter.get("/list-coaches", authMiddleware, listAvailableCoaches);
userRouter.post("/cancel-appointment", authMiddleware, cancelAppointment)
userRouter.post("/payment-stripe", authMiddleware, paymentStripe)
userRouter.post("/verifyStripe", authMiddleware, verifyStripe)

export default userRouter;