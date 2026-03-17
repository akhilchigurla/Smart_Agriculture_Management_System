const express = require('express');
const router = express.Router();
const multer = require('multer');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const auth = require('../middleware/authMiddleware');

const upload = multer({ dest: 'uploads/' });

router.post('/detect', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No image uploaded' });
    
    // --- DYNAMIC MOCK AI FALLBACK FOR PROTOTYPE TESTING ---
    if (process.env.GEMINI_API_KEY === 'mock_key' || !process.env.GEMINI_API_KEY) {
      console.log('Using Dynamic Mock AI Response for testing...');
      
      const mockReports = [
        `## 🔬 Agricultural Diagnosis Report
**Date:** ${new Date().toLocaleDateString()}
**Plant Identified:** Tomato (*Solanum lycopersicum*)

### 🚩 Observations
The image shows signs of **Early Blight** (*Alternaria solani*).
- **Symptoms:** Concentric target spots on leaves.
- **Yellowing:** Chlorosis around infection sites.

### 💊 Treatment Plan
1. Spray Neem Oil or Mancozeb fungicide.
2. Prune lower diseased leaves.
3. Improve soil drainage and avoid overhead watering.`,

        `## 🔬 Agricultural Diagnosis Report
**Date:** ${new Date().toLocaleDateString()}
**Plant Identified:** Potato (*Solanum tuberosum*)

### 🚩 Observations
The image shows signs of **Late Blight** (*Phytophthora infestans*).
- **Symptoms:** Large water-soaked patches on leaves.
- **Fungal Growth:** White mold on the leaf underside in humid conditions.

### 💊 Treatment Plan
1. Apply Copper-based fungicides immediately.
2. Remove and destroy infected plants to prevent spread.
3. Use resistant varieties in the next planting cycle.`,

        `## 🔬 Agricultural Diagnosis Report
**Date:** ${new Date().toLocaleDateString()}
**Plant Identified:** Corn/Maize (*Zea mays*)

### 🚩 Observations
The image shows signs of **Common Rust** (*Puccinia sorghi*).
- **Symptoms:** Small, cinnamon-brown pustules on both leaf surfaces.
- **Context:** Favored by high humidity and moderate temperatures.

### 💊 Treatment Plan
1. Apply Pyraclostrobin or similar foliar fungicides.
2. Plant rust-resistant hybrids.
3. Ensure balanced nitrogen application for crop vigor.`
      ];

      const randomReport = mockReports[Math.floor(Math.random() * mockReports.length)] + 
                           "\n\n*Note: This is a dynamic prototype report generated for testing.*";
      
      if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      return res.json({ analysis: randomReport });
    }
    // ----------------------------------------------

    const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const imageData = Buffer.from(fs.readFileSync(req.file.path)).toString("base64");

    const result = await model.generateContent([
        "Analyze this agricultural crop image in detail. Identify the plant, detect any diseases or pest infestations, explain the symptoms visible, and provide a comprehensive treatment plan including specific pesticides (organic and chemical) and cultural practices. Please format the output as a professional report. If the image is not related to crops or agriculture, please state that clearly.",
        {
          inlineData: {
            data: imageData,
            mimeType: req.file.mimetype
          }
        }
    ]);
    
    const response = await result.response;
    const text = response.text();
    
    fs.unlinkSync(req.file.path);

    res.json({
      analysis: text
    });
  } catch (err) {
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    console.error('AI DETECTION ERROR:', err);
    
    let errorMessage = "Error processing image with AI.";
    if (err.message.includes("API_KEY_INVALID") || err.message.includes("key not found")) {
      errorMessage = "Invalid Gemini API Key. Please replace 'mock_key' with a valid API Key from Google AI Studio (https://aistudio.google.com/app/apikey) in your .env file.";
    } else if (err.message.includes("SAFETY")) {
      errorMessage = "The AI could not analyze this image due to safety filters. Please upload a clear image of the infected crop.";
    }

    res.status(500).json({ 
      error: errorMessage,
      details: err.message
    });
  }
});

module.exports = router;
