const dotenv = require('dotenv');
const path = require('path');

try {
  dotenv.config({ path: path.resolve(__dirname, '../../.env') });
  console.log('[dotenv] injecting env from .env');
} catch (error) {
  console.log('No .env file found');
}

console.log('Environment configuration:');
console.log('PORT:', process.env.PORT);
console.log('USE_MEMORY_DB:', process.env.USE_MEMORY_DB);
console.log('MONGODB_URI:', process.env.MONGODB_URI);

module.exports = {
  PORT: process.env.PORT || 7777,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/sports_scholarship',
  JWT_SECRET: process.env.JWT_SECRET || 'fallback_jwt_secret_key',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '30d',
  USE_MEMORY_DB: process.env.USE_MEMORY_DB === 'true' || false
};

