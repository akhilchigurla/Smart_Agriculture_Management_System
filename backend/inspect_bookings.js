const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Equipment = require('./models/Equipment');

async function checkBookings() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/agri-system');
    console.log('Connected to DB');

    const allEquipment = await Equipment.find({});
    console.log('Total Equipment Count:', allEquipment.length);
    
    allEquipment.forEach(eq => {
      console.log(`ID: ${eq._id}, Name: ${eq.name}, Available: ${eq.isAvailable}, BookedUntil: ${eq.bookedUntil}`);
    });

    await mongoose.connection.close();
  } catch (err) {
    console.error(err);
  }
}

checkBookings();
