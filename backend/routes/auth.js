const express = require('express');
const router = express.Router();
const twilio = require('twilio');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const User = require('../models/User');

const client = (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_ACCOUNT_SID !== 'mock_sid') 
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN) 
  : null;

// Email Transporter Config
const transporter = nodemailer.createTransport({
  service: 'gmail', // or your preferred service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Store OTPs temporarily (In production, use Redis)
const otpStore = new Map();

// Send OTP
router.post('/send-otp', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    // Optional: Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User with this email already exists' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(email, { otp, timestamp: Date.now() });

    console.log(`[DEBUG] Generated OTP for ${email}: ${otp}`);

    // Set a timeout for mail sending
    const sendMailWithTimeout = (mailOptions) => {
      return Promise.race([
        transporter.sendMail(mailOptions),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Email service timeout')), 10000)
        )
      ]);
    };

    try {
      await sendMailWithTimeout({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Smart Agri System - Your Verification Code',
        text: `Your verification code is: ${otp}. It will expire in 10 minutes.`
      });
      res.status(200).json({ message: 'OTP sent successfully' });
    } catch (mailErr) {
      console.error("Email sending failed:", mailErr.message);
      // Fallback: If it fails, we still allow registration in dev by logging it
      // In a real production app, we would strictly return an error
      console.log(`[FALLBACK] Use this OTP for ${email}: ${otp}`);
      
      res.status(200).json({ 
        message: 'OTP could not be sent via email, but a fallback is active (Development Mode). Please check server logs or contact admin.',
        fallback: true 
      });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Register / Signup
router.post('/register', async (req, res) => {
  try {
    const { name, mobileNumber, email, password, landOwned, role, verificationToken } = req.body;
    
    // Verify the verification token
    if (!verificationToken) {
      return res.status(400).json({ message: 'Email must be verified before registration' });
    }

    try {
      const decoded = jwt.verify(verificationToken, process.env.JWT_SECRET);
      if (decoded.email !== email || decoded.purpose !== 'email-verification') {
        return res.status(400).json({ message: 'Invalid verification token' });
      }
    } catch (err) {
      return res.status(400).json({ message: 'Verification token expired or invalid' });
    }

    let user = await User.findOne({ 
      $or: [
        { mobileNumber },
        { email }
      ]
    });
    
    if (user) {
      if (user.mobileNumber === mobileNumber) return res.status(400).json({ message: 'User with this mobile number already exists' });
      if (user.email === email) return res.status(400).json({ message: 'User with this email already exists' });
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    user = new User({ 
      name, 
      mobileNumber, 
      email, 
      password: hashedPassword, 
      landOwned: role === 'dealer' ? 0 : landOwned, 
      role,
      isVerified: true // Already verified via token
    });
    
    await user.save();

    return res.status(201).json({ message: 'Registration successful. Please login.' });
  } catch (err) {
    console.error("Register Error: ", err);
    return res.status(500).json({ message: err.message || 'Server error during registration' });
  }
});

// Forgot Password - Send OTP
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User with this email does not exist' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(email, { otp, timestamp: Date.now(), purpose: 'password-reset' });

    console.log(`[DEBUG] Password Reset OTP for ${email}: ${otp}`);

    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Smart Agri System - Password Reset Code',
        text: `Your password reset code is: ${otp}. It will expire in 10 minutes.`
      });
      res.status(200).json({ message: 'OTP sent to your email' });
    } catch (mailErr) {
      console.error("Forgot Password Email failed:", mailErr.message);
      console.log(`[FALLBACK] Use this reset OTP for ${email}: ${otp}`);
      res.status(200).json({ 
        message: 'OTP could not be sent via email, but a fallback is active. Check server logs.',
        fallback: true 
      });
    }
  } catch (err) {
    console.error("Forgot Password Error: ", err);
    res.status(500).json({ message: 'Error sending OTP' });
  }
});

// Reset Password
router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const storedData = otpStore.get(email);

    if (!storedData || storedData.otp !== otp || storedData.purpose !== 'password-reset') {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    if (Date.now() - storedData.timestamp > 10 * 60 * 1000) {
      otpStore.delete(email);
      return res.status(400).json({ message: 'OTP expired' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findOneAndUpdate({ email }, { password: hashedPassword });
    
    otpStore.delete(email);
    res.status(200).json({ message: 'Password reset successful' });
  } catch (err) {
    console.error("Reset Password Error: ", err);
    res.status(500).json({ message: 'Error resetting password' });
  }
});

// Verify OTP (Pre-registration)
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    const storedData = otpStore.get(email);

    if (!storedData || storedData.otp !== otp) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Check expiry (10 mins)
    if (Date.now() - storedData.timestamp > 10 * 60 * 1000) {
      otpStore.delete(email);
      return res.status(400).json({ message: 'OTP expired' });
    }

    otpStore.delete(email);
    
    // Generate a short-lived verification token (valid for 15 mins)
    const verificationToken = jwt.sign(
      { email, purpose: 'email-verification' }, 
      process.env.JWT_SECRET, 
      { expiresIn: '15m' }
    );

    res.status(200).json({ message: 'Email verified successfully', verificationToken });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Resend OTP
router.post('/resend-otp', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(email, { otp, timestamp: Date.now() });

    console.log(`[DEBUG] Resent OTP for ${email}: ${otp}`);

    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Smart Agri System - Your Verification Code (Resent)',
        text: `Your new verification code is: ${otp}`
      });
      res.status(200).json({ message: 'OTP resent successfully' });
    } catch (mailErr) {
      console.error("Email resend failed:", mailErr.message);
      console.log(`[FALLBACK] Use this resent OTP for ${email}: ${otp}`);
      res.status(200).json({ 
        message: 'OTP could not be resent via email, but a fallback is active. Check server logs.',
        fallback: true 
      });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid Credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid Credentials' });

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
