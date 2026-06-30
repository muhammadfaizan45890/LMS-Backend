import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { fileURLToPath } from 'url';   // ✅ added
import path from 'path';               // ✅ added

// ✅ FIXED PATHS (NO ../)
import connectDB from "./database/db.js";

// ROUTES
import userRoute from "./routes/userRoute.js";
import authRoute from "./routes/authRoute.js";
import adminRoute from "./routes/adminRoute.js";
import enrollRoute from "./routes/enrollRoutes.js";
import moduleRoutes from "./routes/moduleRoutes.js";
import refundRoutes from "./routes/refundRoutes.js";
import notesRoutes from "./routes/notesRoutes.js";
import certificateRoutes from "./routes/certificateRoutes.js";

// ------------------------------------------------------------
// 1. Setup __dirname for ES modules
// ------------------------------------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CONFIG
import "./config/passport.js";

dotenv.config();

const app = express();

// ================= DATABASE =================
connectDB();

// ================= MIDDLEWARE =================
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://lms-courseacademy.vercel.app"
    ],
    credentials: true
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================= STATIC FILES =================
app.use("/files", express.static(path.join(__dirname, "public/files"))); // for notes & other uploads
// app.use("/upload", express.static("upload"));
app.use("/upload", express.static(path.join(__dirname, "upload")));

// ================= ROUTES =================
app.use("/auth", authRoute);
app.use("/user", userRoute);
app.use("/admin", adminRoute);
app.use("/enroll", enrollRoute);
app.use("/api/modules", moduleRoutes);
app.use("/refund", refundRoutes);
app.use("/notes", notesRoutes);
app.use("/certificate", certificateRoutes);

// ================= TEST ROUTE =================
app.get("/", (req, res) => {
  res.send("Backend Running Successfully 🚀");
});

// ================= START SERVER =================
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
