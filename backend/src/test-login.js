const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const testLogin = async () => {
  let mongoServer;
  
  try {
    console.log('Starting login test...');
    
    // Start MongoDB Memory Server
    console.log('Initializing MongoDB Memory Server');
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    console.log(`MongoDB Memory Server started at URI: ${mongoUri}`);
    
    // Connect to the in-memory database
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB Memory Server');
    
    // Create test users
    console.log('\nCreating test users...');
    
    // Delete any existing users (should be none in a fresh memory server)
    await User.deleteMany({});
    
    // Create users using the model's create method to properly trigger the pre-save hook
    console.log('Creating users with User.create()...');
    const users = await User.create([
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'Password123!',
        role: 'admin'
      },
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123!',
        role: 'user'
      }
    ]);
    
    console.log(`Created ${users.length} test users successfully`);
    
    // List all users in the database
    console.log('\nListing all users in the database:');
    const allUsers = await User.find().select('+password');
    allUsers.forEach(user => {
      console.log(`- ${user.email} (${user.role}), Password hash: ${user.password.substring(0, 10)}...`);
    });
    
    // Test login with model's matchPassword method
    console.log('\nTesting login using model matchPassword method:');
    
    // Test admin login
    console.log('\n1. Testing admin login:');
    const adminEmail = 'admin@example.com';
    const adminPassword = 'Password123!';
    
    // Find the admin user
    const foundAdminUser = await User.findOne({ email: adminEmail }).select('+password');
    if (!foundAdminUser) {
      console.log(`Admin user with email ${adminEmail} not found!`);
    } else {
      console.log(`Found admin user: ${foundAdminUser.email} (${foundAdminUser._id})`);
      console.log(`Stored password hash: ${foundAdminUser.password}`);
      
      // Test using the model's matchPassword method
      const isMatch = await foundAdminUser.matchPassword(adminPassword);
      console.log(`Password match result using model method: ${isMatch}`);
      
      // Also test with bcrypt directly
      const directMatch = await bcrypt.compare(adminPassword, foundAdminUser.password);
      console.log(`Password match result using bcrypt directly: ${directMatch}`);
      
      if (isMatch) {
        console.log('Admin login successful!');
      } else {
        console.log('Admin login failed - password does not match');
      }
    }
    
    // Test regular user login
    console.log('\n2. Testing regular user login:');
    const userEmail = 'john@example.com';
    const userPassword = 'Password123!';
    
    // Find the regular user
    const foundRegularUser = await User.findOne({ email: userEmail }).select('+password');
    if (!foundRegularUser) {
      console.log(`Regular user with email ${userEmail} not found!`);
    } else {
      console.log(`Found regular user: ${foundRegularUser.email} (${foundRegularUser._id})`);
      console.log(`Stored password hash: ${foundRegularUser.password}`);
      
      // Test using the model's matchPassword method
      const isMatch = await foundRegularUser.matchPassword(userPassword);
      console.log(`Password match result using model method: ${isMatch}`);
      
      // Also test with bcrypt directly
      const directMatch = await bcrypt.compare(userPassword, foundRegularUser.password);
      console.log(`Password match result using bcrypt directly: ${directMatch}`);
      
      if (isMatch) {
        console.log('Regular user login successful!');
      } else {
        console.log('Regular user login failed - password does not match');
      }
    }
    
    console.log('\nLogin tests completed');
    
  } catch (error) {
    console.error('Error during login test:', error);
  } finally {
    // Clean up - disconnect from database and stop MongoDB Memory Server
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      console.log('Disconnected from MongoDB');
    }
    
    if (mongoServer) {
      await mongoServer.stop();
      console.log('MongoDB Memory Server stopped');
    }
  }
};

// Run the test
testLogin(); 