const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  const { soilType, ph, waterAvailability, season } = req.body;
  // Simple heuristic-based recommendation
  let recommendations = [];
  
  if (soilType === 'clay' && waterAvailability === 'high') {
    recommendations = ['Rice', 'Sugarcane'];
  } else if (soilType === 'sandy' && waterAvailability === 'low') {
    recommendations = ['Millets', 'Groundnut'];
  } else if (soilType === 'loamy') {
    recommendations = ['Cotton', 'Wheat', 'Vegetables'];
  } else {
    recommendations = ['Maize', 'Pulses'];
  }
  
  res.json({
    recommendations,
    message: `Based on your ${soilType} soil (pH ${ph}) and ${waterAvailability} water availability in ${season} season.`
  });
});

module.exports = router;
