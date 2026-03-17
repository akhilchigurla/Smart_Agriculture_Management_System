const express = require('express');
const router = express.Router();
const Fertilizer = require('../models/Fertilizer');
const Booking = require('../models/Booking');
const auth = require('../middleware/authMiddleware');

// Get all fertilizers (can filter by district/mandal/village)
router.get('/', async (req, res) => {
  try {
    const filters = {};
    if (req.query.district) filters.district = req.query.district;
    if (req.query.mandal) filters.mandal = req.query.mandal;
    if (req.query.village) filters.village = req.query.village;
    
    const fertilizers = await Fertilizer.find(filters).populate('addedBy', 'name mobileNumber');
    res.json(fertilizers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add new fertilizer (Dealer/Admin)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'dealer' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only dealers and admins can add fertilizers' });
    }

    const newFertilizer = new Fertilizer({
      ...req.body,
      addedBy: req.user.userId,
      location: req.body.location || { lat: 17.3850, lng: 78.4867 } // Default to Hyderabad
    });
    await newFertilizer.save();
    res.json(newFertilizer);
  } catch (err) {
    console.error('Error adding fertilizer:', err);
    res.status(500).json({ error: err.message });
  }
});

// Book fertilizer bags
router.post('/book', auth, async (req, res) => {
  try {
    const { fertilizerId, landOwned } = req.body;
    // Calculate required bags: assumed 2 bags per acre
    const bagsRequired = landOwned * 2; 

    const fertilizer = await Fertilizer.findById(fertilizerId);
    if (!fertilizer) return res.status(404).json({ message: 'Fertilizer not found' });
    if (fertilizer.bagsAvailable < bagsRequired) {
      return res.status(400).json({ message: `Only ${fertilizer.bagsAvailable} bags available, but you need ${bagsRequired}.` });
    }

    const totalPrice = bagsRequired * fertilizer.pricePerBag;

    const booking = new Booking({
      farmer: req.user.userId,
      fertilizer: fertilizerId,
      bagsBooked: bagsRequired,
      totalPrice
    });

    fertilizer.bagsAvailable -= bagsRequired;
    await fertilizer.save();
    await booking.save();

    res.json({ message: 'Booking successful', booking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user bookings
router.get('/bookings', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ farmer: req.user.userId })
      .populate('fertilizer')
      .populate('equipment');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
