const express = require('express');
const cors = require('cors');
const { startMongoMemoryServer } = require('./setup-mongo-memory');
const User = require('./models/User');
const config = require('./config/config');
const authRoutes = require('./routes/auth');
const applicationRoutes = require('./routes/applications');
const errorHandler = require('./middleware/error');

// Initialize app
const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:8081', 'http://127.0.0.1:8081', 'http://localhost:8082', 'http://127.0.0.1:8082'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationRoutes);

// Simple route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Sports Scholarship API (Development Server)' });
});

// Error handler middleware
app.use(errorHandler);

// Create seed users
const seedUsers = async () => {
  try {
    await User.deleteMany({});
    console.log('Users cleared');

    // Create an admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin'
    });

    // Create a regular user
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
    console.error(`Error seeding users: ${error.message}`);
  }
};

// Start server with in-memory MongoDB
const startServer = async () => {
  try {
    // Start MongoDB Memory Server
    await startMongoMemoryServer();
    
    // Seed the database
    await seedUsers();
    
    // Start Express server
    const PORT = 5002; // Use port 5002 to avoid conflicts
    app.listen(PORT, () => {
      console.log(`Development server running on port ${PORT}`);
      console.log(`Test credentials:`);
      console.log(`Admin: admin@example.com / admin123`);
      console.log(`User: user@example.com / password123`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Initialize the server
startServer(); 