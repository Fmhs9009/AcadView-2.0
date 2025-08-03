const mongoose = require('mongoose');

const timetableFileSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  fileName: {
    type: String,
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  fileType: {
    type: String,
    required: true,
    enum: ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
  },
  type: {
    type: String,
    required: true,
    enum: ['student', 'faculty'],
    default: 'student'
  },
  status: {
    type: String,
    required: true,
    enum: ['current', 'future'],
    default: 'current'
  },
  effectiveDate: {
    type: Date,
    required: function() {
      return this.status === 'future';
    }
  },
  batch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Batch'
  },
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch'
  },
  section: {
    type: String,
    enum: ['A', 'B', 'C', 'D', 'All'],
    default: 'All'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'HOD',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'HOD'
  }
}, {
  timestamps: true
});

// Index for better query performance
timetableFileSchema.index({ type: 1, status: 1 });
timetableFileSchema.index({ batch: 1, branch: 1, section: 1 });
timetableFileSchema.index({ createdBy: 1 });
timetableFileSchema.index({ effectiveDate: 1 });

// Virtual for file URL
timetableFileSchema.virtual('fullFileUrl').get(function() {
  return `${process.env.BASE_URL || 'http://localhost:4000'}${this.fileUrl}`;
});

// Ensure virtual fields are serialized
timetableFileSchema.set('toJSON', {
  virtuals: true
});

module.exports = mongoose.model('TimetableFile', timetableFileSchema);
