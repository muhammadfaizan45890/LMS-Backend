// import jwt from 'jsonwebtoken';
// import { User } from '../models/userModel.js';

// // AUTH MIDDLEWARE
// export const isAuthenticated = async (req, res, next) => {

//     try {

//         const authHeader = req.headers.authorization;

//         if (!authHeader || !authHeader.startsWith('Bearer ')) {
//             return res.status(401).json({
//                 success: false,
//                 message: 'Access token is missing or invalid'
//             });
//         }

//         const token = authHeader.split(" ")[1];

//         jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {

//             if (err) {

//                 if (err.name === "TokenExpiredError") {
//                     return res.status(400).json({
//                         success: false,
//                         message: "Access Token has expired"
//                     });
//                 }

//                 return res.status(400).json({
//                     success: false,
//                     message: "Access token is missing or invalid"
//                 });
//             }

//             const { id } = decoded;

//             const user = await User.findById(id);

//             if (!user) {
//                 return res.status(404).json({
//                     success: false,
//                     message: "User not found"
//                 });
//             }

//             req.user = user;
//             req.userId = user._id;

//             next();
//         });

//     } catch (error) {

//         return res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// };



// // ADMIN MIDDLEWARE
// export const isAdmin = async (req, res, next) => {

//     try {

//         if (!req.user) {
//             return res.status(401).json({
//                 success: false,
//                 message: "Unauthorized"
//             });
//         }

//         if (req.user.role !== "admin") {
//             return res.status(403).json({
//                 success: false,
//                 message: "Access denied. Admin only."
//             });
//         }

//         next();

//     } catch (error) {

//         return res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// };






import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";

// Ensure the JWT secret is defined at startup
const JWT_SECRET = process.env.SECRET_KEY;
if (!JWT_SECRET) {
  console.error("❌ SECRET_KEY is not defined in environment variables.");
  // In production, you might want to throw an error and exit
  // throw new Error("SECRET_KEY is required");
}

// ================================
//        AUTHENTICATION
// ================================
export const isAuthenticated = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access token is missing or invalid",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Attach user to request
    req.user = user;
    req.userId = user._id;

    next();
  } catch (error) {
    // Handle specific JWT errors
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Access token has expired",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid access token",
      });
    }

    // Catch-all for any other errors
    console.error("Auth middleware error:", error);
    return res.status(500).json({
      success: false,
      message: "Authentication failed due to server error",
    });
  }
};

// ================================
//        ADMIN AUTHORIZATION
// ================================
export const isAdmin = (req, res, next) => {
  // Ensure user is authenticated first (isAuthenticated should run before this)
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  // Check if user has admin role (case-insensitive, handles missing role)
  const userRole = req.user.role?.toLowerCase();
  if (userRole !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin privileges required.",
    });
  }

  next();
};
