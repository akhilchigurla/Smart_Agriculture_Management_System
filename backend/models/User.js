const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobileNumber: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  landOwned: { type: Number, required: true }, // in acres
  role: { type: String, enum: ['farmer', 'admin', 'dealer'], default: 'farmer' }, // Added dealer role
  isVerified: { type: Boolean, default: false } // OTP verification status
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
