const mongoose = require('mongoose');
const config = require('./config/config');
const User = require('./models/User');

// Connect to MongoDB
const connectDB = async () => {
  try {
    console.log('Connecting to MongoDB at:', config.MONGODB_URI);
    const conn = await mongoose.connect(config.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Seed users
const seedUsers = async () => {
  try {
    // Clear existing users
    await User.deleteMany({});
    console.log('Users cleared');

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin'
    });

    // Create regular user
    const regularUser = await User.create({
      name: 'Test User',
      email: 'user@example.com',
      password: 'password123',
      role: 'user'
    });

    console.log('Users seeded successfully!');
    console.log(`Admin: ${adminUser.email} (admin123)`);
    console.log(`User: ${regularUser.email} (password123)`);
  } catch (error) {
    console.error('Error seeding users:', error);
  }
};

// Main function
const main = async () => {
  try {
    await connectDB();
    await seedUsers();
    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

// Run the main function
main(); 