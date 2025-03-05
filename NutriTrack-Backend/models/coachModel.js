import mongoose from "mongoose";

const coachSchema = new mongoose.Schema({
    coachId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Links to User
    name: { type: String, required: true },
    //image: { type: String, required: true },
    speciality: { type: String, required: true },
    degree: { type: String, required: true },
    experience: { type: String, required: true },
    about: { type: String, required: true },
    available: { type: Boolean, default: true },
    fees: { type: Number, required: true },
    slots_booked: { type: Object, default: {} },
    address: { type: Object, required: true },
    date: { type: Number, required: true },
}, { minimize: false })

const coachModel = mongoose.models.coach || mongoose.model("coach", coachSchema);
export default coachModel;