const mongoose = require('mongoose');

const StatusHistorySchema = new mongoose.Schema({
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
    required: true
  },
  applicationNumber: {
    type: String,
    required: true
  },
  applicantName: {
    type: String,
    required: true
  },
  previousStatus: {
    type: String,
    enum: ['pending', 'under_review', 'approved', 'rejected'],
    required: true
  },
  newStatus: {
    type: String,
    enum: ['pending', 'under_review', 'approved', 'rejected'],
    required: true
  },
  comment: {
    type: String
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  adminName: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Add indexes for faster queries
StatusHistorySchema.index({ applicationId: 1 });
StatusHistorySchema.index({ newStatus: 1 });
StatusHistorySchema.index({ timestamp: -1 });

module.exports = mongoose.model('StatusHistory', StatusHistorySchema); 