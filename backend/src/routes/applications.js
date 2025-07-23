const express = require('express');
const { 
  createApplication, 
  getApplications, 
  getApplication, 
  updateApplication, 
  deleteApplication, 
  updateStatus,
  uploadDocuments,
  deleteDocument,
  getDocument
} = require('../controllers/applications');

const { protect, authorize } = require('../middleware/auth');
const { upload, handleUploadErrors } = require('../middleware/upload');

const router = express.Router();

// Apply protection to all routes
router.use(protect);

// Debug middleware for file uploads
const debugUploads = (req, res, next) => {
  console.log('Debug middleware called');
  console.log('Request method:', req.method);
  console.log('Request URL:', req.originalUrl);
  console.log('Request headers:', req.headers);
  console.log('Content-Type:', req.get('Content-Type'));
  console.log('Has files?', !!req.files);
  if (req.files) console.log('Files count:', req.files.length);
  console.log('Body keys:', Object.keys(req.body));
  next();
};

// Public routes for logged in users
router.route('/')
  .post(createApplication)
  .get(getApplications);

router.route('/:id')
  .get(getApplication)
  .put(updateApplication)
  .delete(deleteApplication);

// Document upload routes - make sure debugUploads comes AFTER upload middleware
router.post(
  '/:id/documents', 
  (req, res, next) => {
    console.log('Upload route accessed');
    console.log('User in request:', req.user);
    next();
  },
  upload.array('documents', 5), 
  handleUploadErrors,
  debugUploads, 
  uploadDocuments
);

router.delete('/:id/documents/:docId', deleteDocument);
router.get('/:id/documents/:docId', getDocument);

// Admin only routes
router.put('/:id/status', authorize('admin'), updateStatus);

module.exports = router; 