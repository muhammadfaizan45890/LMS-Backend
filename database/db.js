import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error("MONGODB_URI is missing in environment variables");
    }

    await mongoose.connect(mongoURI);

    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.log("❌ MongoDB connection error:");
    console.log(error);

    throw error; // IMPORTANT for Vercel
  }
};

export default connectDB;
