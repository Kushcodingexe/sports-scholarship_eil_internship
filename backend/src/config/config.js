// Load environment variables
const dotenv = require('dotenv');
const path = require('path');

// Try to load .env file if it exists
try {
  dotenv.config({ path: path.resolve(__dirname, '../../.env') });
  console.log('[dotenv] injecting env from .env');
} catch (error) {
  console.log('No .env file found');
}

// Log environment values for debugging
console.log('Environment configuration:');
console.log(`PORT: ${process.env.PORT}`);
console.log(`USE_MEMORY_DB: ${process.env.USE_MEMORY_DB}`);
console.log(`MONGODB_URI: ${process.env.MONGODB_URI ? '(Using provided URI)' : '(Using default)'}`);

module.exports = {
  // Use an uncommon port to avoid conflicts
  PORT: process.env.PORT || 7777,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb+srv://kushsahni:EIL12345@cluster0.2vipzio.mongodb.net/sports_scholarship?retryWrites=true&w=majority&appName=Cluster0',
  JWT_SECRET: process.env.JWT_SECRET || 'fallback_jwt_secret_key',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '30d',
  // Set to false to use real MongoDB instance
  USE_MEMORY_DB: process.env.USE_MEMORY_DB === 'true' || false
};