const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const checkUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    const users = await User.find({});
    console.log('Users found:', JSON.stringify(users, null, 2));
    await mongoose.connection.close();
  } catch (err) {
    console.error('Error:', err);
  }
};

checkUsers();
