const express = require('express');
const router = express.Router();
const PestAlert = require('../models/PestAlert');
const auth = require('../middleware/authMiddleware');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

router.get('/', async (req, res) => {
  try {
    const alerts = await PestAlert.find().populate('addedBy', 'name');
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { description, district, mandal, village, lat, lng } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';
    
    const newAlert = new PestAlert({
      imageUrl,
      description,
      location: { district, mandal, village, lat, lng },
      addedBy: req.user.userId
    });
    
    await newAlert.save();
    res.json(newAlert);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
