const mongoose = require('mongoose');
const Equipment = require('./models/Equipment');
const dotenv = require('dotenv');

dotenv.config();

async function testExpiry() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');

    // 1. Find or create an equipment
    let equipment = await Equipment.findOne();
    if (!equipment) {
      console.log('No equipment found, creating one...');
      equipment = new Equipment({
        name: 'Test Tractor',
        rentalPricePerHour: 100,
        ownerContact: '1234567890',
        location: { lat: 17.3850, lng: 78.4867 },
        district: 'Hyderabad',
        mandal: 'Ameerpet',
        village: 'S.R.Nagar',
        addedBy: new mongoose.Types.ObjectId() // Dummy ID
      });
      await equipment.save();
    }

    // 2. Mock a booked state that is EXPIRED (1 hour ago)
    console.log('Setting equipment to expired booked state...');
    equipment.isAvailable = false;
    equipment.bookedUntil = new Date(Date.now() - 3600000); // 1 hour ago
    await equipment.save();

    console.log(`Current state: name=${equipment.name}, isAvailable=${equipment.isAvailable}, bookedUntil=${equipment.bookedUntil}`);

    // 3. Simulate the GET request logic (which we implemented in the route)
    console.log('Simulating GET /api/equipment (auto-release logic)...');
    const result = await Equipment.updateMany(
      { isAvailable: false, bookedUntil: { $lt: new Date() } },
      { $set: { isAvailable: true }, $unset: { bookedUntil: "" } }
    );
    console.log('Update result:', result);

    // 4. Verify the new state
    const updatedEq = await Equipment.findById(equipment._id);
    console.log(`New state: isAvailable=${updatedEq.isAvailable}, bookedUntil=${updatedEq.bookedUntil}`);

    if (updatedEq.isAvailable === true) {
      console.log('SUCCESS: Equipment auto-released correctly!');
    } else {
      console.log('FAILURE: Equipment not released.');
    }

    await mongoose.disconnect();
  } catch (err) {
    console.error('Test failed:', err);
    process.exit(1);
  }
}

testExpiry();
