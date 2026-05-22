// import mongoose from "mongoose";

// const connectDB = async () => {
//   try {
//     const uri = process.env.MONGODB_URI;

//     if (!uri) {
//       console.log("❌ MONGODB_URI is missing in Railway env variables");
//       return;
//     }

//     await mongoose.connect(uri);

//     console.log("✅ MongoDB connected successfully");
//   } catch (err) {
//     console.log("❌ MongoDB connection failed:");
//     console.log(err.message);
//   }
// };

// export default connectDB;


import mongoose from "mongoose";

const connectDB = async () => {
  console.log("🔥 MONGODB_URI =", process.env.MONGODB_URI);
};

export default connectDB;
