const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rentalPricePerHour: { type: Number, required: true },
  isAvailable: { type: Boolean, default: true },
  bookedUntil: { type: Date },
  ownerContact: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  district: { type: String, required: true },
  mandal: { type: String, required: true },
  village: { type: String, required: true },
  imageUrl: { type: String, default: 'https://via.placeholder.com/300?text=Equipment' },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Equipment', equipmentSchema);
