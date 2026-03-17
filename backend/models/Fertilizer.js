const mongoose = require('mongoose');

const fertilizerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  bagsAvailable: { type: Number, required: true },
  pricePerBag: { type: Number, required: true },
  shopName: { type: String, required: true },
  district: { type: String, required: true },
  mandal: { type: String, required: true },
  village: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  imageUrl: { type: String, default: 'https://via.placeholder.com/300?text=Fertilizer' },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Fertilizer', fertilizerSchema);
