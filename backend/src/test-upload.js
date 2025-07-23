const path = require('path');
const fs = require('fs');
const multer = require('multer');
const express = require('express');

// Create a test express app
const app = express();

// Log the relevant paths
console.log('Current working directory:', process.cwd());
console.log('__dirname:', __dirname);

// Test upload directories
const uploadDir = path.join(__dirname, '../uploads');
const testUserDir = path.join(uploadDir, 'test-user');

console.log('Upload directory path:', uploadDir);
console.log('Test user directory path:', testUserDir);

// Try to create directories
try {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log('Created upload directory successfully');
  } else {
    console.log('Upload directory already exists');
    // Check if it's writable
    try {
      fs.accessSync(uploadDir, fs.constants.W_OK);
      console.log('Upload directory is writable');
    } catch (err) {
      console.error('Upload directory is not writable:', err.message);
    }
  }

  if (!fs.existsSync(testUserDir)) {
    fs.mkdirSync(testUserDir, { recursive: true });
    console.log('Created test user directory successfully');
  } else {
    console.log('Test user directory already exists');
  }
} catch (error) {
  console.error('Error creating directories:', error.message);
}

// Try to create a test file
try {
  const testFilePath = path.join(testUserDir, 'test-file.txt');
  fs.writeFileSync(testFilePath, 'This is a test file');
  console.log('Test file created successfully at:', testFilePath);
  
  // Check if file exists
  if (fs.existsSync(testFilePath)) {
    console.log('Test file exists and is readable');
  }
} catch (error) {
  console.error('Error creating test file:', error.message);
}

// Test multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, testUserDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-test-file.txt`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

app.post('/test-upload', upload.single('testfile'), (req, res) => {
  console.log('File received:', req.file);
  res.send({ success: true, file: req.file });
});

// Just log information, don't actually start the server
console.log('Test completed. If no errors above, the file system permissions are correct.');
console.log('To test the actual upload endpoint, you can run:');
console.log('curl -X POST -F "testfile=@./some-local-file.txt" http://localhost:5000/test-upload'); 