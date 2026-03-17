const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const createTestUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const email = 'testuser@example.com';
    const password = 'password123';
    
    // Delete if exists
    await User.deleteOne({ email });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name: 'Test User',
      mobileNumber: '1234567890',
      email: email,
      password: hashedPassword,
      landOwned: 5,
      role: 'farmer',
      isVerified: true
    });

    await user.save();
    console.log('Test user created successfully');
    await mongoose.connection.close();
  } catch (err) {
    console.error('Error:', err);
  }
};

createTestUser();
