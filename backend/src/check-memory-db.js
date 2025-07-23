const mongoose = require('mongoose');
const { startMongoMemoryServer } = require('./setup-mongo-memory');
const User = require('./models/User');

async function checkMemoryDatabase() {
  try {
    console.log('Initializing MongoDB Memory Server');
    const { mongoUri } = await startMongoMemoryServer();
    console.log(`MongoDB Memory Server URI: ${mongoUri}`);
    
    // List all users in the database
    const users = await User.find({}).select('-password');
    console.log(`Found ${users.length} users in the database:`);
    
    if (users.length === 0) {
      console.log('No users found. Database appears to be empty.');
    } else {
      users.forEach((user, index) => {
        console.log(`\nUser ${index + 1}:`);
        console.log(`- Name: ${user.name}`);
        console.log(`- Email: ${user.email}`);
        console.log(`- Role: ${user.role}`);
        console.log(`- Created At: ${user.createdAt}`);
      });
    }
    
    // Close the connection
    await mongoose.connection.close();
    console.log('Connection closed.');
  } catch (error) {
    console.error(`Error checking memory database: ${error.message}`);
    console.error(error);
  }
}

// Run the check
checkMemoryDatabase(); 