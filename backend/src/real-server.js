const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('./config/config');
const authRoutes = require('./routes/auth');
const applicationRoutes = require('./routes/applications');
const errorHandler = require('./middleware/error');
const corsMiddleware = require('./middleware/cors');

// Initialize app
const app = express();

// Body parser
app.use(express.json());

// Apply custom CORS middleware first
app.use(corsMiddleware);

// Enable CORS - allow all origins for development
app.use(cors({
  origin: '*', // Allow all origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Access-Control-Allow-Origin']
}));

// Add pre-flight options for all routes
app.options('*', cors());

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationRoutes);

// Simple route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Sports Scholarship API (Real MongoDB)' });
});

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', uptime: process.uptime() });
});

// Error handler middleware
app.use(errorHandler);

// Connect to MongoDB
const connectDB = async () => {
  try {
    console.log('Connecting to MongoDB at:', config.MONGODB_URI);
    const conn = await mongoose.connect(config.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database Name: ${conn.connection.name}`);
    console.log(`Connection State: ${conn.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    if (error.name === 'MongoServerSelectionError') {
      console.error('Make sure MongoDB is running on your machine or update the connection string');
    }
    process.exit(1);
  }
};

// Start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Start Express server
    const PORT = config.PORT;
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Server accessible at http://localhost:${PORT}`);
      console.log(`Test endpoint at http://localhost:${PORT}/health`);
      console.log(`API endpoints at http://localhost:${PORT}/api/*`);
      console.log('CORS enabled for all origins');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Initialize the server
startServer(); 