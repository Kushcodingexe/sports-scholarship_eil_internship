const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

// Load env vars
dotenv.config({ path: path.join(__dirname, 'config/config.env') });

// Create sample user for testing
const testUser = {
  id: new mongoose.Types.ObjectId().toString(),
  name: 'Test User',
  email: 'test@example.com',
  role: 'user'
};

// Create auth token
const createToken = () => {
  return jwt.sign({ id: testUser.id }, process.env.JWT_SECRET || 'testsecret', {
    expiresIn: '1d'
  });
};

// Upload directory setup
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Create email-based directory
    const userEmail = req.user.email;
    const sanitizedEmail = userEmail.replace(/[@.]/g, '_');
    console.log(`Using email ${userEmail} (sanitized: ${sanitizedEmail}) for directory`);
    
    const userDir = path.join(uploadDir, sanitizedEmail);
    console.log(`Creating user directory at: ${userDir}`);
    
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }
    
    cb(null, userDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;
    console.log(`Generated filename: ${uniqueName}`);
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf', 
    'image/jpeg', 
    'image/png',
    'text/plain' // For testing
  ];
  
  console.log(`File mime type: ${file.mimetype}`);
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    console.log(`Rejected file: ${file.originalname}, mimetype: ${file.mimetype}`);
    cb(new Error(`Unsupported file format: ${file.mimetype}`), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }
});

// Create Express app
const app = express();

// Auth middleware for testing
const authMiddleware = (req, res, next) => {
  req.user = testUser;
  next();
};

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({
    success: false,
    error: err.message
  });
});

// Create test routes
app.post(
  '/test-upload', 
  authMiddleware, 
  (req, res, next) => {
    console.log('Auth middleware passed, user:', req.user);
    next();
  },
  upload.single('document'),
  (req, res) => {
    try {
      console.log('File upload handler reached');
      
      if (!req.file) {
        console.log('No file was uploaded');
        return res.status(400).json({
          success: false,
          message: 'No file uploaded'
        });
      }
      
      console.log('File uploaded successfully:', req.file);
      
      res.json({
        success: true,
        file: req.file
      });
    } catch (error) {
      console.error('Error in upload handler:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
);

// Create test file
const createTestFile = () => {
  const testFilePath = path.join(__dirname, 'test-document.txt');
  fs.writeFileSync(testFilePath, 'This is a test document');
  console.log(`Created test file at: ${testFilePath}`);
  return testFilePath;
};

// Start server and test
const PORT = 5001;
const server = app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  
  try {
    // Create test file
    const testFilePath = createTestFile();
    
    // Test upload using internal request
    console.log('Testing file upload...');
    
    // We need to simulate a real HTTP request with file upload
    console.log(`
    To test the upload manually, run this command in a new terminal:
    
    curl -X POST -H "Authorization: Bearer ${createToken()}" -F "document=@${testFilePath}" http://localhost:${PORT}/test-upload
    
    Or use a tool like Postman to send a multipart form request with a file
    `);
    
    console.log(`
    Debug Info:
    - Upload directory: ${uploadDir}
    - Test user ID: ${testUser.id}
    - Test user email: ${testUser.email}
    - Expected user upload path: ${path.join(uploadDir, testUser.email.replace(/[@.]/g, '_'))}
    `);
    
  } catch (error) {
    console.error('Error during test:', error);
  }
});

// Clean up
process.on('SIGINT', () => {
  console.log('Cleaning up...');
  try {
    // Remove test file
    const testFilePath = path.join(__dirname, 'test-document.txt');
    if (fs.existsSync(testFilePath)) {
      fs.unlinkSync(testFilePath);
      console.log('Test file removed');
    }
  } catch (error) {
    console.error('Error cleaning up:', error);
  }
  process.exit();
}); 