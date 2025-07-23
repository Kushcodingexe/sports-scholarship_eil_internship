const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '../../uploads');
console.log('Upload directory path:', uploadDir);

if (!fs.existsSync(uploadDir)) {
  console.log('Creating upload directory...');
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('Upload directory created');
} else {
  console.log('Upload directory already exists');
  // Check if directory is writable
  try {
    fs.accessSync(uploadDir, fs.constants.W_OK);
    console.log('Upload directory is writable');
  } catch (err) {
    console.error('Upload directory is not writable!', err);
    // Try to fix permissions (Unix only)
    try {
      fs.chmodSync(uploadDir, 0o755);
      console.log('Changed upload directory permissions');
    } catch (chmodErr) {
      console.error('Failed to change directory permissions', chmodErr);
    }
  }
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('Storage destination called');
    
    if (!req.user) {
      console.error('User missing in request');
      return cb(new Error('User authentication required'), null);
    }
    
    if (!req.user.email) {
      console.error('User email missing in request');
      return cb(new Error('User email not found'), null);
    }
    
    const userEmail = req.user.email;
    console.log('User email for upload directory:', userEmail);
    
    // Sanitize email for use as directory name - replace @ and dots with underscores
    const sanitizedEmail = userEmail.replace(/[@.]/g, '_');
    console.log('Sanitized email for directory:', sanitizedEmail);
    
    const userDir = path.join(uploadDir, sanitizedEmail);
    console.log('User directory path:', userDir);
    
    // Create user-specific directory if it doesn't exist
    if (!fs.existsSync(userDir)) {
      console.log('Creating user directory...');
      try {
        fs.mkdirSync(userDir, { recursive: true });
        console.log('User directory created');
      } catch (err) {
        console.error('Failed to create user directory:', err);
        return cb(err);
      }
    } else {
      console.log('User directory already exists');
    }
    
    cb(null, userDir);
  },
  filename: (req, file, cb) => {
    console.log('Storage filename called for file:', file.originalname);
    // Generate unique filename: timestamp-originalname
    const sanitizedName = file.originalname.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.-]/g, '_');
    const uniqueName = `${Date.now()}-${sanitizedName}`;
    console.log('Generated filename:', uniqueName);
    cb(null, uniqueName);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  console.log('File filter called for:', file.originalname, 'mimetype:', file.mimetype);
  // Accept common document formats
  const allowedTypes = [
    'application/pdf', 
    'image/jpeg', 
    'image/png',
    'image/jpg', 
    'application/msword', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain' // For testing
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    console.log('File type accepted');
    cb(null, true);
  } else {
    console.log('File type rejected');
    cb(new Error(`Unsupported file format: ${file.mimetype}. Allowed formats: PDF, JPEG, PNG, DOC, DOCX, XLS, XLSX`), false);
  }
};

// Create the multer upload instance
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB max file size
  }
});

// Error handling middleware
const handleUploadErrors = (err, req, res, next) => {
  console.error('Multer error:', err);
  
  // Check if files were received
  console.log('Files received:', req.files);
  console.log('Request body:', req.body);
  
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 10MB.'
      });
    }
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
  
  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
  
  next();
};

module.exports = {
  upload,
  handleUploadErrors
}; 