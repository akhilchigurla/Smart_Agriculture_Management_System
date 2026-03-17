const express = require('express');
const router = express.Router();
const Equipment = require('../models/Equipment');
const Booking = require('../models/Booking');
const auth = require('../middleware/authMiddleware');

// Get all available equipment
router.get('/', async (req, res) => {
  try {
    // Auto-release expired bookings or those without a timestamp
    await Equipment.updateMany(
      { 
        isAvailable: false, 
        $or: [
          { bookedUntil: { $lt: new Date() } },
          { bookedUntil: { $exists: false } }
        ]
      },
      { $set: { isAvailable: true }, $unset: { bookedUntil: "" } }
    );

    const equipment = await Equipment.find().populate('addedBy', 'name mobileNumber');
    res.json(equipment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add new equipment
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'dealer' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only dealers and admins can add equipment' });
    }

    const newEquipment = new Equipment({
      ...req.body,
      addedBy: req.user.userId,
      location: req.body.location || { lat: 17.3850, lng: 78.4867 } // Default to Hyderabad
    });
    await newEquipment.save();
    res.json(newEquipment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Book equipment
router.post('/book', auth, async (req, res) => {
  try {
    const { equipmentId, rentalHours } = req.body;
    console.log('Booking attempt:', { equipmentId, rentalHours, user: req.user.userId });
    
    if (!rentalHours || rentalHours <= 0) return res.status(400).json({ message: 'Invalid rental hours' });

    const equipment = await Equipment.findById(equipmentId);
    console.log('Found equipment:', equipment);
    
    if (!equipment) return res.status(404).json({ message: 'Equipment not found' });
    if (!equipment.isAvailable) return res.status(400).json({ message: 'Equipment already booked' });

    const totalPrice = (equipment.rentalPricePerHour || 0) * rentalHours;

    const booking = new Booking({
      farmer: req.user.userId,
      equipment: equipmentId,
      rentalHours,
      totalPrice,
      status: 'confirmed'
    });

    equipment.isAvailable = false;
    equipment.bookedUntil = new Date(Date.now() + rentalHours * 60 * 60 * 1000);
    await equipment.save();
    await booking.save();
    
    console.log('Booking created successfully:', booking._id);

    res.json({ message: `Booking successful for ${rentalHours} hours. Total: ₹${totalPrice}`, booking });
  } catch (err) {
    console.error('SERVER ERROR IN BOOKING:', err);
    res.status(500).json({ message: err.message }); // Changed 'error' to 'message' to match frontend expectation
  }
});

module.exports = router;
