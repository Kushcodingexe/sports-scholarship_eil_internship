const mongoose = require('mongoose');
const config = require('./config/config');
const User = require('./models/User');

// Connect to MongoDB
const connectDB = async () => {
  try {
    console.log('Connecting to MongoDB at:', config.MONGODB_URI);
    const conn = await mongoose.connect(config.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database Name: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

// Check database contents
const checkDB = async () => {
  try {
    // Check users
    const users = await User.find().select('-password');
    console.log('\nUsers in database:');
    console.log(JSON.stringify(users, null, 2));
    
    // Count users
    const userCount = await User.countDocuments();
    console.log(`\nTotal users: ${userCount}`);
    
    // Count by role
    const adminCount = await User.countDocuments({ role: 'admin' });
    const regularUserCount = await User.countDocuments({ role: 'user' });
    console.log(`Admin users: ${adminCount}`);
    console.log(`Regular users: ${regularUserCount}`);
    
  } catch (error) {
    console.error('Error checking database:', error);
  }
};

// Main function
const main = async () => {
  try {
    await connectDB();
    await checkDB();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

// Run the main function
main();
