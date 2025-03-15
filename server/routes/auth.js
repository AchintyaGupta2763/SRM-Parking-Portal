const express = require('express');
const router = express.Router();
const { signup, login, generateOTP, verifyOTP, signupWithOTP, verifySignupOTP } = require('../controllers/authController');

router.post('/signup', signup);
router.post('/login', login);
router.post('/generate-otp', generateOTP); // New route
router.post('/verify-otp', verifyOTP); // New route
router.post('/signup-with-otp', signupWithOTP); // New: Generate OTP for signup
router.post('/verify-signup-otp', verifySignupOTP); // New: Verify OTP for signup


module.exports = router;