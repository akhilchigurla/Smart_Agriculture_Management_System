const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fertilizer: { type: mongoose.Schema.Types.ObjectId, ref: 'Fertilizer' },
  equipment: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipment' },
  bagsBooked: { type: Number },
  rentalHours: { type: Number },
  totalPrice: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
