import appointmentModel from "../models/appointmentModel.js";
import coachModel from "../models/coachModel.js";
import {User} from "../models/index.js";
import mongoose from "mongoose";

// API to get all appointments list
const appointmentsAdmin = async (req, res) => {
    try {

        const appointments = await appointmentModel.find({})
        res.json({ success: true, appointments })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API for appointment cancellation
const appointmentCancel = async (req, res) => {
    try {

        const { appointmentId } = req.body
        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })

        res.json({ success: true, message: 'Appointment Cancelled' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API for adding Coach
// const addCoach = async (req, res) => {

//     try {

//         const { name, email, password, speciality, degree, experience, about, fees, address } = req.body
//         const imageFile = req.file

//         // checking for all data to add coach
//         if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
//             return res.json({ success: false, message: "Missing Details" })
//         }

//         // validating email format
//         if (!validator.isEmail(email)) {
//             return res.json({ success: false, message: "Please enter a valid email" })
//         }

//         // validating strong password
//         if (password.length < 8) {
//             return res.json({ success: false, message: "Please enter a strong password" })
//         }

//         // hashing user password
//         const salt = await bcrypt.genSalt(10); // the more no. round the more time it will take
//         const hashedPassword = await bcrypt.hash(password, salt)

//         // upload image to cloudinary
//         const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" })
//         const imageUrl = imageUpload.secure_url

//         const coachData = {
//             name,
//             email,
//             image: imageUrl,
//             password: hashedPassword,
//             speciality,
//             degree,
//             experience,
//             about,
//             fees,
//             address: JSON.parse(address),
//             date: Date.now()
//         }

//         const newCoach = new coachModel(coachData)
//         await newCoach.save()
//         res.json({ success: true, message: 'Coach Added' })

//     } catch (error) {
//         console.log(error)
//         res.json({ success: false, message: error.message })
//     }
// }

// API to get all coachs list for admin panel
const allCoaches = async (req, res) => {
    try {

        const coachs = await coachModel.find({}).select('-password')
        res.json({ success: true, coachs })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get dashboard data for admin panel
const adminDashboard = async (req, res) => {
    try {

        const coaches = await coachModel.find({})
        const users = await User.find({})
        const appointments = await appointmentModel.find({})

        const dashData = {
            coaches: coaches.length,
            appointments: appointments.length,
            patients: users.length,
            latestAppointments: appointments.reverse()
        }

        res.json({ success: true, dashData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const promoteToAdmin = async (req, res) => {
    try {
      const { userId } = req.body; // The user to be promoted
  
      // Ensure the requesting user is an admin
      if (req.user.userType !== "admin") {
        return res
          .status(403)
          .json({
            success: false,
            message: "Access denied. Only admins can promote users.",
          });
      }
  
      // Validate if userId is a proper MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid user ID format." });
      }
      // Find the user to promote
      const user = await User.findById(userId);
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found." });
      }
  
      // Check if the user is already an admin
      if (user.userType === "admin") {
        return res
          .status(400)
          .json({ success: false, message: "User is already an admin." });
      }
  
      // Promote the user to admin
      user.userType = "admin";
      await user.save();
  
      res
        .status(200)
        .json({ success: true, message: "User promoted to admin successfully." });
    } catch (error) {
      console.error("Error promoting user:", error);
      res
        .status(500)
        .json({ success: false, message: "Server error, try again later." });
    }
  };

  const promoteToCoach = async (req, res) => {
    try {
      const { userId } = req.body; // The user to be promoted
  
      // Ensure the requesting user is an admin
      if (req.user.userType !== "admin") {
        return res
          .status(403)
          .json({
            success: false,
            message: "Access denied. Only admins can promote users.",
          });
      }
  
      // Validate if userId is a proper MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid user ID format." });
      }
      // Find the user to promote
      const user = await User.findById(userId);
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found." });
      }
  
      // Check if the user is already an admin
      if (user.userType === "coach") {
        return res
          .status(400)
          .json({ success: false, message: "User is already a coach." });
      }
  
      // Promote the user to admin
      user.userType = "coach";
      await user.save();
  
      res
        .status(200)
        .json({ success: true, message: "User promoted to coach successfully." });
    } catch (error) {
      console.error("Error promoting user:", error);
      res
        .status(500)
        .json({ success: false, message: "Server error, try again later." });
    }
  };

export {
    appointmentsAdmin,
    appointmentCancel,
    allCoaches,
    adminDashboard,
    promoteToAdmin,
    promoteToCoach,
}