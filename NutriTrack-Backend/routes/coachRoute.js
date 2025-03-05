import express from 'express';
import { appointmentsCoach, appointmentCancel, coachList, changeAvailablity, appointmentComplete, coachDashboard, coachProfile, updateCoachProfile, updateCoach} from '../controllers/coachController.js';
import { authMiddleware } from "../middleware/authMiddleware.js";
const coachRouter = express.Router();


coachRouter.post("/cancel-appointment", authMiddleware, appointmentCancel)
coachRouter.get("/appointments", authMiddleware, appointmentsCoach)
coachRouter.get("/list", coachList)
coachRouter.post("/change-availability", authMiddleware, changeAvailablity)
coachRouter.post("/complete-appointment", authMiddleware, appointmentComplete)
coachRouter.get("/dashboard", authMiddleware, coachDashboard)
coachRouter.get("/profile", authMiddleware, coachProfile)
coachRouter.post("/update-profile", authMiddleware, updateCoachProfile)
coachRouter.post("/update-coach", authMiddleware, updateCoach)

export default coachRouter;