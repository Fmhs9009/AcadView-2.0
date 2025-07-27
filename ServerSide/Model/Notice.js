const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'senderModel'
  },
  senderModel: {
    type: String,
    required: true,
    enum: ['HOD', 'Faculty']
  },
  senderName: {
    type: String,
    required: true
  },
  senderDepartment: {
    type: String,
    required: true
  },
  audience: {
    type: String,
    required: true,
    enum: ['students', 'faculty', 'both']
  },
  targetBatch: {
    type: String,
    default: null // null means all batches
  },
  targetSection: {
    type: String,
    default: null // null means all sections
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  expirationDate: {
    type: Date,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  readBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'readBy.userModel'
    },
    userModel: {
      type: String,
      enum: ['Student', 'Faculty', 'HOD']
    },
    readAt: {
      type: Date,
      default: Date.now
    }
  }],
  attachments: [{
    filename: String,
    originalName: String,
    path: String,
    size: Number,
    mimetype: String
  }]
}, {
  timestamps: true
});

// Index for better query performance
noticeSchema.index({ createdAt: -1 });
noticeSchema.index({ audience: 1 });
noticeSchema.index({ senderDepartment: 1 });
noticeSchema.index({ isActive: 1 });

// Virtual for checking if notice is expired
noticeSchema.virtual('isExpired').get(function() {
  if (!this.expirationDate) return false;
  return new Date() > this.expirationDate;
});

// Method to check if user has read the notice
noticeSchema.methods.isReadBy = function(userId) {
  return this.readBy.some(read => read.user.toString() === userId.toString());
};

// Method to mark as read by user
noticeSchema.methods.markAsRead = function(userId, userModel) {
  if (!this.isReadBy(userId)) {
    this.readBy.push({
      user: userId,
      userModel: userModel,
      readAt: new Date()
    });
  }
};

module.exports = mongoose.model('Notice', noticeSchema);
