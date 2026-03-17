# Smart Agriculture Management System

A comprehensive MERN stack web application designed to empower farmers with modern technology, right from the roots of tradition. This system provides a range of services from marketplace for fertilizers and equipment to AI-powered disease detection and weather monitoring.

## 🚀 Features

### 🌾 Marketplace & Rentals
- **Fertilizer Marketplace**: Browse and book fertilizers based on location. Dealers can add and manage listings, while out-of-stock items are automatically hidden.
- **Equipment Rental**: Rent machinery (tractors, harvesters, etc.) on an hourly basis. Includes a **real-time countdown timer** showing when equipment will be available next.

### 🤖 AI & Advisory
- **Disease Detection**: AI-powered analysis of crop diseases with recommended treatments.
- **Pest Alerts**: Stay informed about potential pest threats in your area.
- **Crop Advisory**: Expert guidance on crop management and growth.
- **Drip Irrigation**: Smart guidance for efficient water management.

### 📍 Location & Weather
- **Dynamic Location Filtering**: Filter services specifically by Telangana's Districts, Mandals, and Villages.
- **Weather Monitoring**: Live weather updates tailored to agricultural needs.

### 🔐 Security & Roles
- **Multi-Role System**: Distinct workflows for **Farmers**, **Dealers**, and **Admins**.
- **Secure Auth**: Authentication with OTP support and role-based access control.

## 🛠 Tech Stack

- **Frontend**: React (Vite), Axios, Leaflet (Maps), i18next (Multilingual), Vanilla CSS.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose).
- **AI Integration**: Google Gemini AI (@google/generative-ai).
- **Other**: Nodemailer (Email/OTP), Twilio (SMS), Multer (File uploads).

## 💻 Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   ```

2. **Backend Setup**:
   - Navigate to `/backend`
   - Install dependencies: `npm install`
   - Create a `.env` file (see `.env.example`) and add your:
     - `MONGO_URI`
     - `JWT_SECRET`
     - `EMAIL_USER` / `EMAIL_PASS` (for OTP)
     - `GEMINI_API_KEY` (for AI features)
   - Start the server: `npm start` (Runs on port 5001)

3. **Frontend Setup**:
   - Navigate to `/frontend`
   - Install dependencies: `npm install`
   - Start the development server: `npm run dev` (Runs on port 5173)

## 🌐 Localization
The application supports multiple languages:
- **English**
- **Telugu (తెలుగు)**

---
Developed to modernize agriculture and support the farming community.
