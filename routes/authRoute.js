// import express from "express";
// import passport from "passport";
// import jwt from "jsonwebtoken";
// import { isAuthenticated } from "../middleware/isAuthenticated.js";

// const router = express.Router();

// // Google Login
// router.get(
//   "/google",
//   passport.authenticate("google", {
//     scope: ["profile", "email"],
//   })
// );

// // Google Callback
// router.get(
//   "/google/callback",
//   passport.authenticate("google", {
//     session: false,
//   }),
//   (req, res) => {
//     try {
//       const token = jwt.sign(
//         {
//           id: req.user._id,
//           email: req.user.email,
//         },
//         process.env.SECRET_KEY,
//         {
//           expiresIn: "7d",
//         }
//       );

//       const clientURL =
//         process.env.CLIENT_URL || "https://lms-courseacademy.vercel.app";

//       res.redirect(
//         `${clientURL}/auth-success?token=${token}`
//       );
//     } catch (error) {
//       console.error("Google login error:", error);

//       const clientURL =
//         process.env.CLIENT_URL || "http://localhost:5173";

//       res.redirect(
//         `${clientURL}/login?error=google_failed`
//       );
//     }
//   }
// );

// // Current User
// router.get("/me", isAuthenticated, (req, res) => {
//   return res.status(200).json({
//     success: true,
//     user: req.user,
//   });
// });

// export default router;







import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { isAuthenticated } from "../middleware/isAuthenticated.js";

const router = express.Router();

// Environment variables with fallbacks (but production should have them set)
const CLIENT_URL = process.env.CLIENT_URL || "https://lms-courseacademy.vercel.app";
const JWT_SECRET = process.env.SECRET_KEY;
if (!JWT_SECRET) {
  console.error("❌ SECRET_KEY is not defined in environment variables!");
  // In production, you might want to throw an error or exit.
}

// Google Login – initiates OAuth flow
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// Google Callback – after Google redirects back
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,          // We're using JWT, not sessions
    failureRedirect: `${CLIENT_URL}/login?error=google_auth_failed`,
  }),
  (req, res) => {
    try {
      // Ensure user object exists
      if (!req.user) {
        throw new Error("Authentication failed: no user data");
      }

      // Generate JWT
      const token = jwt.sign(
        {
          id: req.user._id,
          email: req.user.email,
        },
        JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );

      // Redirect to frontend with token
      res.redirect(`${CLIENT_URL}/auth-success?token=${token}`);
    } catch (error) {
      console.error("Google login error:", error);
      // Redirect to frontend login with error message
      res.redirect(`${CLIENT_URL}/login?error=google_failed`);
    }
  }
);

// Get current user (protected by JWT)
router.get("/me", isAuthenticated, (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user,
  });
});

export default router;
