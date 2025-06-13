import mongoose from "mongoose";

const trackingSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    foodId: {
      type: mongoose.Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId(),
      unique: true,
    },
    foodName: {
      type: String,
      required: true,
    },
    details: {
      calories: Number,
      protein: Number,
      carbohydrates: Number,
      fat: Number,
      fiber: Number,
    },
    eatenDate: {
      type: String,
      default: () => new Date().toLocaleDateString('en-CA'),
    },
    quantity: {
      type: Number,
      min: 1,
      required: true,
    },
    servingUnit: {
      type: String,
      required: true,
    },
    eatenWhen: {
      type: String,
      enum: ["breakfast", "AM snack", "lunch", "PM snack", "dinner"],
      required: true,
    },
  },
  { timestamps: true },
);


const trackingModel = mongoose.model("trackedFood", trackingSchema);
export default trackingModel;
