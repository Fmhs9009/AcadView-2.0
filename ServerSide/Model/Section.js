// models/Section.js
const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    uppercase: true
  },
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
    required: true
  },
  batch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Batch',
    required: true
  },
  capacity: {
    type: Number,
    default: 60
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// Compound index to ensure unique section for a branch and batch combination
sectionSchema.index({ name: 1, branch: 1, batch: 1 }, { unique: true });

const Section = mongoose.model('Section', sectionSchema);
module.exports = Section;