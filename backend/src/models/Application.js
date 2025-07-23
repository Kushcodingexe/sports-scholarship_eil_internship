const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  applicationId: {
    type: String,
    unique: true
  },
  name: {
    type: String,
    required: [true, 'Please provide applicant name'],
    trim: true
  },
  // Basic Information fields
  title: {
    type: String,
    trim: true
  },
  firstName: {
    type: String,
    trim: true
  },
  middleName: {
    type: String,
    trim: true
  },
  lastName: {
    type: String,
    trim: true
  },
  fatherName: {
    type: String,
    trim: true
  },
  motherName: {
    type: String,
    trim: true
  },
  dateOfBirth: {
    type: String
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  mobile: {
    type: String,
    required: [true, 'Please provide a mobile number']
  },
  addressLine1: {
    type: String,
    trim: true
  },
  addressLine2: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    trim: true
  },
  state: {
    type: String,
    trim: true
  },
  postalCode: {
    type: String,
    trim: true
  },
  nationalId: {
    type: String
  },
  
  // Academic Information fields
  highestExamPassed: {
    type: String,
    trim: true
  },
  yearOfPassing: {
    type: String
  },
  schoolUniversityName: {
    type: String,
    trim: true
  },
  institution: {
    type: String,
    trim: true
  },
  institutionType: {
    type: String,
    trim: true
  },
  scholarshipCategory: {
    type: String,
    trim: true
  },
  
  // Sports fields
  engineeringField: {
    type: String,
    required: [true, 'Please specify engineering field']
  },
  typeOfSports: {
    type: String
  },
  sportsType: {
    type: String,
    required: [true, 'Please specify sports type']
  },
  SportsName: {
    type: String
  },
  positionLevel: {
    type: String
  },
  resultMetrics: {
    type: String
  },
  TournamentDate: {
    type: String
  },
  
  status: {
    type: String,
    enum: ['pending', 'under_review', 'approved', 'rejected'],
    default: 'pending'
  },
  documents: [{
    fileName: String,
    originalName: String,
    fileType: String,
    fileSize: Number,
    path: String,
    documentType: String,
    uploadDate: {
      type: Date,
      default: Date.now
    }
  }],
  comments: [{
    content: String,
    date: {
      type: Date,
      default: Date.now
    },
    actionType: {
      type: String,
      enum: ['approve', 'reject', 'comment']
    }
  }],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Generate a unique application ID before saving
ApplicationSchema.pre('save', async function(next) {
  if (!this.applicationId) {
    // Generate a unique ID like APP001, APP002, etc.
    const count = await this.constructor.countDocuments();
    this.applicationId = `APP${(count + 1).toString().padStart(3, '0')}`;
  }
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Application', ApplicationSchema); 