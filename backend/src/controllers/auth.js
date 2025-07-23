const User = require('../models/User');

// @desc    Debug endpoint to get all users
// @route   GET /api/auth/debug/users
// @access  Public (should be restricted in production)
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error("Get all users error:", error);
    next(error);
  }
};

// @desc    Seed database with sample users
// @route   POST /api/auth/debug/seed
// @access  Public (should be restricted in production)
exports.seedUsers = async (req, res, next) => {
  try {
    console.log("Seeding database with sample users");
    
    // Delete existing users
    await User.deleteMany({});
    
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
    
    res.status(201).json({
      success: true,
      count: users.length,
      message: 'Sample users created successfully'
    });
  } catch (error) {
    console.error("Seed users error:", error);
    next(error);
  }
};

// @desc    Register a user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    console.log("Registration request received:", req.body);
    const { 
      email, 
      password, 
      firstName, 
      lastName, 
      college, 
      engineeringField, 
      phone, 
      yearOfStudy, 
      role 
    } = req.body;

    // Check required fields
    if (!email || !password || !firstName || !lastName) {
      console.log("Missing required fields:", { 
        email: !!email, 
        password: !!password, 
        firstName: !!firstName, 
        lastName: !!lastName 
      });
      return res.status(400).json({
        success: false,
        message: 'Please provide email, password, first name and last name'
      });
    }

    // Construct a full name from firstName and lastName
    const name = `${firstName} ${lastName}`;
    console.log("Constructed name:", name);

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log("Email already registered:", email);
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Default role to 'user' if not specified or if trying to register as admin
    const userRole = role === 'admin' ? 'user' : role || 'user';
    console.log("Creating user with role:", userRole);

    // Create user with all provided information
    const userData = {
      name,
      email,
      password,
      role: userRole,
      // Add additional user information
      phone: phone || '',
      college: college || '',
      engineeringField: engineeringField || '',
      yearOfStudy: yearOfStudy || ''
    };

    console.log("Creating user with data:", userData);
    
    const user = await User.create(userData);

    console.log("User created successfully:", user._id);
    sendTokenResponse(user, 201, res);
  } catch (error) {
    console.error("Registration error:", error);
    
    // Mongoose validation error
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    console.log("Login request received:", req.body);
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      console.log("Missing email or password");
      return res.status(400).json({
        success: false,
        message: 'Please provide an email and password'
      });
    }

    // Check for user
    console.log(`Searching for user with email: ${email}`);
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      console.log(`User not found with email: ${email}`);
      
      // List all users in the database for debugging
      const allUsers = await User.find({}, 'email');
      console.log(`Available users in database: ${JSON.stringify(allUsers)}`);
      
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    console.log(`User found: ${user._id}`);
    
    // Check if password matches
    const isMatch = await user.matchPassword(password);
    console.log(`Password match result: ${isMatch}`);
    
    if (!isMatch) {
      console.log("Password doesn't match for:", email);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    console.log("User logged in successfully:", user._id);
    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error("Login error:", error);
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error("Get current user error:", error);
    next(error);
  }
};

// @desc    Logout / clear cookie
// @route   GET /api/auth/logout
// @access  Private
exports.logout = async (req, res, next) => {
  res.status(200).json({
    success: true,
    message: 'User logged out successfully'
  });
};

// Helper function to get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  const userData = {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    college: user.college,
    engineeringField: user.engineeringField,
    yearOfStudy: user.yearOfStudy
  };
  
  console.log("Sending token response for user:", userData);

  res.status(statusCode).json({
    success: true,
    token,
    user: userData
  });
}; 