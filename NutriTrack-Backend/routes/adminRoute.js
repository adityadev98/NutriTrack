import express from 'express';
import { appointmentsAdmin, appointmentCancel, allCoaches, adminDashboard, promoteToAdmin, promoteToCoach} from '../controllers/adminController.js';
import { changeAvailablity } from '../controllers/coachController.js';
import { authMiddleware } from "../middleware/authMiddleware.js";
const adminRouter = express.Router();

// adminRouter.post("/add-doctor", authMiddleware, upload.single('image'), addDoctor)
adminRouter.get("/appointments", authMiddleware, appointmentsAdmin)
adminRouter.post("/cancel-appointment", authMiddleware, appointmentCancel)
adminRouter.get("/all-coaches", authMiddleware, allCoaches)
adminRouter.post("/change-availability", authMiddleware, changeAvailablity)
adminRouter.get("/dashboard", authMiddleware, adminDashboard)
adminRouter.post("/promote-to-admin", authMiddleware, promoteToAdmin);
adminRouter.post("/promote-to-coach", authMiddleware, promoteToCoach);
export default adminRouter;