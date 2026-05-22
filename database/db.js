import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.log("❌ Missing MONGODB_URI");
      return;
    }

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("✅ MongoDB connected");
  } catch (err) {
    console.log("❌ MongoDB error:", err.message);
  }
};

export default connectDB;
