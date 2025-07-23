const express = require('express');
const { 
  getAllStatusHistory,
  getApplicationStatusHistory,
  getStatusHistoryStats
} = require('../controllers/statusHistory');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Protect all routes
router.use(protect);

// Admin-only routes
router.get('/', authorize('admin'), getAllStatusHistory);
router.get('/stats', authorize('admin'), getStatusHistoryStats);

// Application-specific route
router.get('/application/:id', getApplicationStatusHistory);

module.exports = router; 