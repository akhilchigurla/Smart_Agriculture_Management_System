const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('UNHANDLED REJECTION:', reason);
});

dotenv.config({ path: path.join(__dirname, '.env') });
connectDB();

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Debug middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});
app.use('/uploads', express.static('uploads'));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/fertilizers', require('./routes/fertilizers'));
app.use('/api/equipment', require('./routes/equipment'));
app.use('/api/advisory', require('./routes/advisory'));
app.use('/api/disease', require('./routes/disease'));
app.use('/api/pests', require('./routes/pests'));

app.get("/", (req, res) => {
  res.send("Backend Running Successfully 🚀");
});

const PORT = process.env.PORT || 5000;

// Production setup
if (process.env.NODE_ENV === 'production') {
  const distPath = path.resolve(__dirname, '..', 'frontend', 'dist');
  app.use(express.static(distPath));
  
  // Catch-all route for SPA
  app.use((req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

const server = app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));

// Render health check and timeout fixes
server.keepAliveTimeout = 120000; // 120 seconds
server.headersTimeout = 120500;   // slightly more than keepAliveTimeout
