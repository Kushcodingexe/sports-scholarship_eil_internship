const mongoose = require('mongoose');
const User = require('./models/User');
const config = require('./config/config');

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Seed Users
const seedUsers = async () => {
  try {
    console.log('Seeding database with sample users...');
    
    // Delete existing users
    await User.deleteMany({});
    console.log('Cleared existing users');
    
    // Create sample users
    const users = await User.create([
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'Password123!',
        role: 'admin',
        phone: '+91 9876543210',
        college: 'IIT Delhi',
        engineeringField: 'Computer Science',
        yearOfStudy: '3rd Year'
      },
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123!',
        role: 'user',
        phone: '+91 9876543211',
        college: 'NIT Trichy',
        engineeringField: 'Electrical Engineering',
        yearOfStudy: '2nd Year'
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'Password123!',
        role: 'user',
        phone: '+91 9876543212',
        college: 'BITS Pilani',
        engineeringField: 'Mechanical Engineering',
        yearOfStudy: '4th Year'
      }
    ]);
    
    console.log(`${users.length} sample users created successfully`);
    
    // Print user emails for reference
    users.forEach(user => {
      console.log(`- Created user: ${user.email} (${user.role})`);
    });
    
    return users;
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
};

// Run the seed function and then disconnect
const seedDatabase = async () => {
  const conn = await connectDB();
  await seedUsers();
  
  mongoose.connection.close();
  console.log('Database connection closed');
};

// Run the seeding
seedDatabase();

module.exports = seedUsers; 