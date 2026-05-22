import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
      console.log("❌ MONGODB_URI is missing");
      return;
    }

    await mongoose.connect(uri);

    console.log("✅ MongoDB connected");
  } catch (err) {
    console.log("❌ MongoDB error:");
    console.log(err.message);
  }
};

export default connectDB;
