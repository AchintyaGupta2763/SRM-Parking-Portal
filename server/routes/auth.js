const express = require('express');
const router = express.Router();
const { signup, login, generateOTP, verifyOTP } = require('../controllers/authController');

router.post('/signup', signup);
router.post('/login', login);
router.post('/generate-otp', generateOTP); // New route
router.post('/verify-otp', verifyOTP); // New route

module.exports = router;