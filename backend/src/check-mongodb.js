const mongoose = require('mongoose');
const config = require('./config/config');

async function checkMongoDBConnection() {
  try {
    console.log('MongoDB Connection Check');
    console.log('=======================');
    console.log(`Attempting to connect to MongoDB at: ${config.MONGODB_URI}`);
    
    // Set timeout to 5 seconds
    const conn = await mongoose.connect(config.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000 // 5 seconds
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database Name: ${conn.connection.name}`);
    console.log(`Connection State: ${conn.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
    console.log('Connection successful! MongoDB is accessible.');
    
    // Check if we can access collections
    const collections = await conn.connection.db.listCollections().toArray();
    console.log(`\nAvailable collections: ${collections.length}`);
    collections.forEach(col => {
      console.log(` - ${col.name}`);
    });
    
    // Close the connection
    await mongoose.connection.close();
    console.log('\nConnection closed.');
  } catch (error) {
    console.error('\nFailed to connect to MongoDB:');
    console.error(`Error: ${error.message}`);
    console.error('\nPossible causes:');
    console.error(' - MongoDB is not installed on your machine');
    console.error(' - MongoDB service is not running');
    console.error(' - Connection URI is incorrect');
    console.error('\nSolutions:');
    console.error(' - Install MongoDB from: https://www.mongodb.com/try/download/community');
    console.error(' - Start MongoDB service');
    console.error(' - Check config.js and update MONGODB_URI if needed');
  }
}

// Run the check
checkMongoDBConnection(); 