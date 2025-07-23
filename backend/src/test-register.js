const mongoose = require('mongoose');
const { startMongoMemoryServer } = require('./setup-mongo-memory');
const User = require('./models/User');

async function testRegistration() {
  try {
    console.log('Initializing MongoDB Memory Server');
    const { mongoUri } = await startMongoMemoryServer();
    console.log(`MongoDB Memory Server URI: ${mongoUri}`);
    
    // Create a test user
    const testUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'Password123!',
      role: 'user',
      phone: '+91 9876543213',
      college: 'Test College',
      engineeringField: 'Test Engineering',
      yearOfStudy: '1st Year'
    };
    
    console.log('Attempting to register a new user:');
    console.log(`- Name: ${testUser.name}`);
    console.log(`- Email: ${testUser.email}`);
    
    // Check if user already exists
    let user = await User.findOne({ email: testUser.email });
    
    if (user) {
      console.log(`User with email ${testUser.email} already exists.`);
    } else {
      // Create new user
      user = await User.create(testUser);
      console.log('User registered successfully!');
      console.log(`- User ID: ${user._id}`);
      console.log(`- Created At: ${user.createdAt}`);
    }
    
    // List all users in the database
    const users = await User.find({}).select('-password');
    console.log(`\nFound ${users.length} total users in the database:`);
    
    users.forEach((u, index) => {
      console.log(`\nUser ${index + 1}:`);
      console.log(`- Name: ${u.name}`);
      console.log(`- Email: ${u.email}`);
      console.log(`- Role: ${u.role}`);
    });
    
    // Close the connection
    await mongoose.connection.close();
    console.log('\nConnection closed.');
  } catch (error) {
    console.error(`Error during registration test: ${error.message}`);
    console.error(error);
  }
}

// Run the test
testRegistration(); 