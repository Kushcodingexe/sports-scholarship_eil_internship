/**
 * Direct Test Script
 * This bypasses the API and directly tests the database connection
 */

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('./models/User');

// Connect to MongoDB Memory Server
async function runTest() {
  console.log('Starting direct database test...');
  
  // Start MongoDB Memory Server
  const mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  console.log(`MongoDB Memory Server started at URI: ${mongoUri}`);
  
  try {
    // Connect to database
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB Memory Server');
    
    // Create a user directly
    console.log('Creating test user...');
    const testUser = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'Password123!',
      role: 'user',
      phone: '+91 9999999999',
      college: 'Test University',
      engineeringField: 'Computer Science'
    });
    
    // Save the user to database
    const savedUser = await testUser.save();
    console.log('User created successfully!');
    console.log('User ID:', savedUser._id);
    console.log('User details:', {
      name: savedUser.name,
      email: savedUser.email,
      role: savedUser.role
    });
    
    // Find all users
    console.log('\nFetching all users...');
    const users = await User.find();
    console.log(`Found ${users.length} users`);
    
    // List users
    users.forEach((user, index) => {
      console.log(`\nUser ${index + 1}:`);
      console.log('ID:', user._id);
      console.log('Name:', user.name);
      console.log('Email:', user.email);
      console.log('Role:', user.role);
    });
    
  } catch (error) {
    console.error('Test failed with error:', error);
  } finally {
    // Disconnect from database
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      console.log('Disconnected from MongoDB Memory Server');
    }
    
    // Stop MongoDB Memory Server
    await mongoServer.stop();
    console.log('MongoDB Memory Server stopped');
  }
}

// Run the test
runTest()
  .then(() => console.log('Test completed.'))
  .catch(err => console.error('Unhandled error:', err)); 