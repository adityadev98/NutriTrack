import coachModel from "../models/coachModel.js";
import appointmentModel from "../models/appointmentModel.js";
import { User } from "../models/index.js";

// API to get coach appointments for coach panel
const appointmentsCoach = async (req, res) => {
    try {

        console.log("checking appointment coach");
        let coachId = req.user.id;
        coachId = coachId.toString(); 
        console.log("Fetching appointments for Coach ID:", coachId);

        const appointments = await appointmentModel.find({ coachId });

        console.log("Appointments Found:", appointments);

        res.json({ success: true, appointments });

    } catch (error) {
        console.log("Error fetching coach appointments:", error);
        res.json({ success: false, message: error.message });
    }
};


// API to cancel appointment for coach panel
const appointmentCancel = async (req, res) => {
    try {

        const { appointmentId } = req.body
        const coachId = req.user.id;
        const appointmentData = await appointmentModel.findById(appointmentId)
        if (appointmentData && appointmentData.coachId === coachId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })
            return res.json({ success: true, message: 'Appointment Cancelled' })
        }

        res.json({ success: false, message: 'Appointment Cancelled' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to mark appointment completed for coach panel
const appointmentComplete = async (req, res) => {
    try {

        const { appointmentId } = req.body
        const coachId = req.user.id;
        const appointmentData = await appointmentModel.findById(appointmentId)
        if (appointmentData && appointmentData.coachId === coachId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true })
            return res.json({ success: true, message: 'Appointment Completed' })
        }

        res.json({ success: false, message: 'Appointment Cancelled' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to get all coaches list for Frontend
const coachList = async (req, res) => {
    try {

        const coaches = await coachModel.find({}).select(['-password', '-email'])
        res.json({ success: true, coaches })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to change coach availablity for Admin and Coach Panel
const changeAvailablity = async (req, res) => {
    try {

        const coachId = req.user.id;
        const coachData = await coachModel.findById(coachId)
        await coachModel.findByIdAndUpdate(coachId, { available: !coachData.available })
        res.json({ success: true, message: 'Availablity Changed' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get coach profile for  Coach Panel
const coachProfile = async (req, res) => {
    try {

        const coachId = req.user.id;
        const profileData = await coachModel.findById(coachId).select('-password')

        res.json({ success: true, profileData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to update coach profile data from  Coach Panel
const updateCoachProfile = async (req, res) => {
    try {

        const { fees, address, available } = req.body
        const coachId = req.user.id;
        await coachModel.findByIdAndUpdate(coachId, { fees, address, available })

        res.json({ success: true, message: 'Profile Updated' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get dashboard data for coach panel
const coachDashboard = async (req, res) => {
    try {

        const coachId = req.user.id;
        const appointments = await appointmentModel.find({ coachId })

        let earnings = 0

        appointments.map((item) => {
            if (item.isCompleted || item.payment) {
                earnings += item.amount
            }
        })

        let patients = []

        appointments.map((item) => {
            if (!patients.includes(item.userId)) {
                patients.push(item.userId)
            }
        })



        const dashData = {
            earnings,
            appointments: appointments.length,
            patients: patients.length,
            latestAppointments: appointments.reverse()
        }

        res.json({ success: true, dashData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const updateCoach = async (req, res) => {
    try {
        const coachId = req.user.id;

        // Find the user and ensure they are a coach
        const user = await User.findById(coachId);
        if (!user || user.userType !== "coach") {
            return res.status(403).json({ success: false, message: "Access denied. Only coaches can update their profile." });
        }

        // Extract values from request body
        const { name, speciality, degree, experience, about, fees, address } = req.body;

        // Ensure required fields are provided
        if (!name || !speciality || !degree || !experience || !about || !fees || !address) {
            return res.status(400).json({ success: false, message: "All fields are required!" });
        }

        // Find coach profile and update
        let coachProfile = await coachModel.findOne({ coachId });

        if (!coachProfile) {
            // Create a new coach profile if not exists
            coachProfile = new coachModel({
                coachId,
                name,
                speciality,
                degree,
                experience,
                about,
                fees,
                address,
                date: Date.now()
            });
        } else {
            // Update existing profile
            coachProfile.name = name;
            coachProfile.speciality = speciality;
            coachProfile.degree = degree;
            coachProfile.experience = experience;
            coachProfile.about = about;
            coachProfile.fees = fees;
            coachProfile.address = address;
            coachProfile.date = Date.now();
        }

        await coachProfile.save();

        res.status(200).json({
            success: true,
            message: "Coach profile updated successfully!",
            coachProfile
        });

    } catch (error) {
        console.error("Error updating coach profile:", error);
        res.status(500).json({ success: false, message: "Server error. Please try again later." });
    }
};

export {
    appointmentsCoach,
    appointmentCancel,
    coachList,
    changeAvailablity,
    appointmentComplete,
    coachDashboard,
    coachProfile,
    updateCoachProfile,
    updateCoach,
}