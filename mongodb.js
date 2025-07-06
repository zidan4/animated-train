import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

export const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  try {
    await mongoose.connect(MONGO_URI);
    console.log("🔥 MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Error:", error);
  }
};

