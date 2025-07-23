/**
 * Debug Helper Script for MongoDB Memory Server
 * 
 * This script provides functions to help debug registration issues with the database
 * It's meant to be used during development only and should be removed in production
 */

const axios = require('axios');
const colors = require('colors/safe');

// API base URL
const API_URL = 'http://localhost:7777/api/auth';

// Helper function to print responses nicely
const printResponse = (title, data) => {
  console.log('\n' + colors.bold.green('='.repeat(40)));
  console.log(colors.bold.white(title));
  console.log(colors.bold.green('='.repeat(40)));
  console.log(colors.cyan(JSON.stringify(data, null, 2)));
  console.log(colors.bold.green('='.repeat(40)) + '\n');
};

// Seed the database with sample users
const seedUsers = async () => {
  try {
    console.log(colors.yellow('Seeding database with sample users...'));
    const response = await axios.post(`${API_URL}/debug/seed`);
    printResponse('Seed Response', response.data);
  } catch (error) {
    console.error(colors.red('Error seeding users:'));
    console.error(colors.red(error.response?.data || error.message));
  }
};

// Get all users from database
const getAllUsers = async () => {
  try {
    console.log(colors.yellow('Fetching all users from database...'));
    const response = await axios.get(`${API_URL}/debug/users`);
    printResponse('Users in Database', response.data);
  } catch (error) {
    console.error(colors.red('Error fetching users:'));
    console.error(colors.red(error.response?.data || error.message));
  }
};

// Register a test user
const registerTestUser = async () => {
  try {
    const userData = {
      email: 'test@example.com',
      password: 'Password123!',
      firstName: 'Test',
      lastName: 'User',
      college: 'Test University',
      engineeringField: 'Computer Science',
      phone: '+91 9999999999'
    };
    
    console.log(colors.yellow('Registering test user...'));
    console.log(colors.blue('User data:'), userData);
    
    const response = await axios.post(`${API_URL}/register`, userData);
    printResponse('Registration Response', response.data);
  } catch (error) {
    console.error(colors.red('Error registering test user:'));
    console.error(colors.red(error.response?.data || error.message));
  }
};

// Main function to run all debug operations
const runDebug = async () => {
  console.log(colors.bold.green('\n=== DEBUG HELPER RUNNING ===\n'));
  
  // Seed database first
  await seedUsers();
  
  // Get all users to verify seeding worked
  await getAllUsers();
  
  // Try registering a test user
  await registerTestUser();
  
  // Get all users again to verify registration worked
  await getAllUsers();
  
  console.log(colors.bold.green('\n=== DEBUG HELPER COMPLETED ===\n'));
};

// Run the debug helper if executed directly
if (require.main === module) {
  runDebug().catch(err => console.error(colors.red('Debug helper error:'), err));
}

// Export functions for use in other scripts
module.exports = {
  seedUsers,
  getAllUsers,
  registerTestUser,
  runDebug
}; 