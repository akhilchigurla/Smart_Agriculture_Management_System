const mongoose = require('mongoose');

const pestAlertSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  description: { type: String, required: true },
  location: {
    district: { type: String },
    mandal: { type: String },
    village: { type: String },
    lat: { type: Number },
    lng: { type: Number }
  },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('PestAlert', pestAlertSchema);
