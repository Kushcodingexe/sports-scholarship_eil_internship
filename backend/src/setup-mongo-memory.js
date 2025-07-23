const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongoServer;

const startMongoMemoryServer = async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  console.log(`MongoDB Memory Server started at URI: ${mongoUri}`);
  
  await mongoose.connect(mongoUri);
  console.log('Connected to MongoDB Memory Server');
  
  return { mongoUri, mongoServer };
};

const stopMongoMemoryServer = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB Memory Server');
  }
  
  if (mongoServer) {
    await mongoServer.stop();
    console.log('MongoDB Memory Server stopped');
  }
};

module.exports = {
  startMongoMemoryServer,
  stopMongoMemoryServer
}; 