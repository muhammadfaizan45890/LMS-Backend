import express from "express";

import {
    changePassword,
    forgotPassword,
    loginUser,
    logoutUser,
    registerUser,
    verification,
    verifyOTP
} from "../controllers/userController.js";

import {
    isAuthenticated,
    isAdmin
} from "../middleware/isAuthenticated.js";

import {
    userSchema,
    validateUser
} from "../validators/userValidate.js";

const router = express.Router();


// PUBLIC ROUTES
router.post('/register', validateUser(userSchema), registerUser);

router.post('/verify', verification);

router.post('/login', loginUser);

router.post('/forgot-password', forgotPassword);

router.post('/verify-otp/:email', verifyOTP);

router.post('/change-password/:email', changePassword);


// PROTECTED ROUTE
router.post('/logout', isAuthenticated, logoutUser);


// ADMIN ROUTE
router.get(
    '/admin/dashboard',
    isAuthenticated,
    isAdmin,
    (req, res) => {

        res.status(200).json({
            success: true,
            message: "Welcome Admin",
            admin: req.user
        });

    }
);

export default router;