import {User as user} from "../models/index.js";
import coachModel from "../models/coachModel.js";
import appointmentModel from "../models/appointmentModel.js";
import stripe from "stripe";


// Gateway Initialize
const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY)

// API to book appointment 
const bookAppointment = async (req, res) => {
    try {
        const { coachId, slotDate, slotTime } = req.body;
        const userId = req.user.id;
        console.log("User ID:", userId);

        // ✅ Fetch the latest coach data
        const coachData = await coachModel.findOne({ coachId }).select("-password");

        if (!coachData || !coachData.available) {
            return res.json({ success: false, message: "Coach Not Available" });
        }

        let slots_booked = coachData.slots_booked || {}; // Ensure `slots_booked` exists

        // ✅ Ensure slots_booked is properly updated
        if (!slots_booked[slotDate]) {
            slots_booked[slotDate] = [];
        }

        if (slots_booked[slotDate].includes(slotTime)) {
            return res.json({ success: false, message: "Slot Not Available" });
        }

        slots_booked[slotDate].push(slotTime);

        console.log("Updated Slots Booked:", slots_booked);

        const userData = await user.findById(userId).select("-password");

        const appointmentData = {
            userId,
            coachId,
            userData,
            coachData,
            amount: coachData.fees,
            slotTime,
            slotDate,
            date: Date.now()
        };

        const newAppointment = new appointmentModel(appointmentData);
        await newAppointment.save();

        // ✅ Save updated `slots_booked` to `coachModel`
        await coachModel.findByIdAndUpdate(coachData._id, { slots_booked });

        res.json({ success: true, message: "Appointment Booked", appointmentId: newAppointment._id });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};


// API to cancel appointment
const cancelAppointment = async (req, res) => {
    try {
        const { appointmentId } = req.body;

        // Fetch appointment details
        const appointmentData = await appointmentModel.findById(appointmentId);

        if (!appointmentData) {
            return res.json({ success: false, message: "Appointment not found!" });
        }

        console.log("User ID:", req.user.id);
        console.log("Appointment Data:", appointmentData);

        const { coachId, slotDate, slotTime, cancelled } = appointmentData;

        // Verify appointment user
        if (appointmentData.userId.toString() !== req.user.id) {
            return res.json({ success: false, message: "Unauthorized action" });
        }

        // ✅ If appointment is already canceled, return the appropriate message
        if (cancelled) {
            return res.json({ success: false, message: "Appointment is already canceled!" });
        }

        // ✅ Step 1: Mark the appointment as canceled first
        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

        // Fetch fresh coach details from `coachModel`
        const coachData = await coachModel.findOne({ coachId });

        if (!coachData) {
            return res.json({ success: false, message: "Coach not found in database!" });
        }

        console.log("Fetched Coach Data:", coachData);

        // Ensure `slots_booked` exists
        let slots_booked = coachData.slots_booked || {}; // Default to empty object if undefined

        // ✅ Step 2: Check if the slot still exists in `slots_booked`
        if (slots_booked[slotDate] && slots_booked[slotDate].includes(slotTime)) {
            // Remove the slot from the booked list
            slots_booked[slotDate] = slots_booked[slotDate].filter(slot => slot !== slotTime);

            // If no slots remain for this date, remove the date entry
            if (slots_booked[slotDate].length === 0) {
                delete slots_booked[slotDate];
            }

            // ✅ Step 3: Update the coach's slots after the appointment is marked canceled
            await coachModel.findByIdAndUpdate(coachData._id, { slots_booked });

            return res.json({ success: true, message: "Appointment Cancelled" });
        } else {
            console.log(`❌ Slot not found in booked slots for date ${slotDate}.`);
            return res.json({ success: false, message: "Slot was never booked or was already removed!" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};


// API to get user appointments for frontend my-appointments page
const listAppointment = async (req, res) => {
    try {

        const userId = req.user.id;
        console.log("Fetching Profile for User ID:", userId);

        const appointments = await appointmentModel.find({ userId })

        res.json({ success: true, appointments })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}
// API to get available coaches for frontend
const listAvailableCoaches = async (req, res) => {
    try {
      const coaches = await coachModel.find({ available: true }).select("-password");
  
      res.status(200).json({
        success: true,
        coaches,
      });
    } catch (error) {
      console.error("Error fetching available coaches:", error);
      res.status(500).json({
        success: false,
        message: "Server error while fetching coaches.",
      });
    }
  };
// API to make payment of appointment using Stripe
const paymentStripe = async (req, res) => {
    try {

        const { appointmentId } = req.body
        const { origin } = req.headers

        const appointmentData = await appointmentModel.findById(appointmentId)

        if (!appointmentData || appointmentData.cancelled) {
            return res.json({ success: false, message: 'Appointment Cancelled or not found' })
        }

        const currency = process.env.CURRENCY.toLocaleLowerCase()

        const line_items = [{
            price_data: {
                currency,
                product_data: {
                    name: "Appointment Fees"
                },
                unit_amount: appointmentData.amount * 100
            },
            quantity: 1
        }]

        const session = await stripeInstance.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&appointmentId=${appointmentData._id}`,
            cancel_url: `${origin}/verify?success=false&appointmentId=${appointmentData._id}`,
            line_items: line_items,
            mode: 'payment',
        })

        res.json({ success: true, session_url: session.url });

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const verifyStripe = async (req, res) => {
    try {

        const { appointmentId, success } = req.body

        if (success === "true") {
            await appointmentModel.findByIdAndUpdate(appointmentId, { payment: true })
            return res.json({ success: true, message: 'Payment Successful' })
        }

        res.json({ success: false, message: 'Payment Failed' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

export {
    bookAppointment,
    listAppointment,
    listAvailableCoaches, 
    cancelAppointment,
    paymentStripe,
    verifyStripe
}