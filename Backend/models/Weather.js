import mongoose from "mongoose";

const weatherSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  city: {
    type: String,
    required: true,
    trim: true,
  },
  temperature: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  humidity: {
    type: Number,
    required: true,
  },
  savedAt: {
    type: Date,
    default: Date.now,
  },
  refreshedAt: {
    type: Date,
    default: null,
  },
});

// Optional but helpful for clean JSON output (removes __v)
weatherSchema.set("toJSON", {
  transform: (_, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});

export default mongoose.model("Weather", weatherSchema);
