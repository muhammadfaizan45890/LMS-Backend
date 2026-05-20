import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./database/db.js";

// ROUTES
import userRoute from "./routes/userRoute.js";
import authRoute from "./routes/authRoute.js";
import adminRoute from "./routes/adminRoute.js";
import enrollRoute from "./routes/enrollRoutes.js";
import moduleRoutes from "./routes/moduleRoutes.js";
import refundRoutes from "./routes/refundRoutes.js";
import notesRoutes from "./routes/notesRoutes.js";

// CONFIG
import "./config/passport.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// ================= MIDDLEWARE =================
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

// ✅ IMPORTANT: must come before routes for form-data safety
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================= STATIC FILES =================

// uploaded notes access
app.use("/files", express.static("public/files"));

// (optional if you still use old uploads)
app.use("/uploads", express.static("uploads"));

// ================= ROUTES =================
app.use("/auth", authRoute);
app.use("/user", userRoute);
app.use("/admin", adminRoute);
app.use("/enroll", enrollRoute);
app.use("/api/modules", moduleRoutes);
app.use("/refund", refundRoutes);
app.use("/notes", notesRoutes);

// ================= START SERVER =================
const startServer = async () => {
  try {
    await connectDB();
    console.log("✅ MongoDB Connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("❌ DB Connection Failed:", error);
  }
};

startServer();