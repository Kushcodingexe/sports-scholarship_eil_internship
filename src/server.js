const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('./config/config');
const errorHandler = require('./middleware/error');
const { startMongoMemoryServer } = require('./setup-mongo-memory');
const User = require('./models/User');

// Route files
const authRoutes = require('./routes/auth');
const applicationRoutes = require('./routes/applications');

// Initialize app
const app = express();

// Body parser
app.use(express.json());

// Enable CORS with more permissive settings for development
app.use(cors({
  origin: '*', // Allow all origins for development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationRoutes);

// Simple route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Sports Scholarship API', status: 'online' });
});

// Heartbeat endpoint to check if server is alive
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', uptime: process.uptime() });
});

// Error handler middleware
app.use(errorHandler);

// Seed the database with default users
const seedDefaultUsers = async () => {
  try {
    console.log('Seeding database with default users...');
    
    // Check if there are any existing users
    const userCount = await User.countDocuments();
    
    if (userCount > 0) {
      console.log(`Found ${userCount} existing users, skipping seed.`);
      return;
    }
    
    // Create default users
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
    
    console.log(`${users.length} default users created successfully`);
    
    // Log the emails for reference
    users.forEach(user => {
      console.log(`- Created user: ${user.email} (${user.role})`);
    });
    
    return users;
  } catch (error) {
    console.error('Error seeding default users:', error);
  }
};

// Connect to MongoDB or MongoDB Memory Server
const connectDB = async () => {
  try {
    console.log(`Using memory DB? ${config.USE_MEMORY_DB ? 'Yes' : 'No'}`);
    
    // Check if we should use the in-memory database
    if (config.USE_MEMORY_DB) {
      console.log('Initializing MongoDB Memory Server');
      const { mongoUri } = await startMongoMemoryServer();
      console.log(`MongoDB Memory Server URI: ${mongoUri}`);
      
      // Seed the database with default users
      await seedDefaultUsers();
    } else {
      // Connect to regular MongoDB instance
      console.log(`Attempting to connect to MongoDB at: ${config.MONGODB_URI}`);
      try {
        const conn = await mongoose.connect(config.MONGODB_URI, {
          serverSelectionTimeoutMS: 10000, // 10 seconds
          socketTimeoutMS: 45000, // 45 seconds
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        
        // Also seed the regular database if needed
        await seedDefaultUsers();
      } catch (mongoError) {
        console.error('Failed to connect to MongoDB:', mongoError.message);
        console.log('Falling back to MongoDB Memory Server');
        
        const { mongoUri } = await startMongoMemoryServer();
        console.log(`MongoDB Memory Server URI: ${mongoUri}`);
        
        // Seed the database with default users
        await seedDefaultUsers();
      }
    }
  } catch (error) {
    console.error(`Error during database connection: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
};

// Start server
const startServer = async () => {
  // Connect to the database
  await connectDB();
  
  const PORT = config.PORT;
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Server accessible at http://localhost:${PORT}`);
    console.log(`Health check available at http://localhost:${PORT}/health`);
    console.log(`API endpoints at http://localhost:${PORT}/api/*`);
  });
  
  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
  });
};

// Start the server
startServer(); 