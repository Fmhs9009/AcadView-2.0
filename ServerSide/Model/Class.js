// models/Class.js
const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  batch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Batch',
    required: true
  },
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
    required: true
  },
  section: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Section',
    required: true
  },
  semester: {
    type: Number,
    min: 1,
    max: 8,
    required: true
  },
  classString: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  }]
}, { timestamps: true });

// Compound index to ensure unique class for a batch, branch, section, and semester combination
classSchema.index({ batch: 1, branch: 1, section: 1, semester: 1 }, { unique: true });

// Pre-save middleware to generate the classString
classSchema.pre('save', async function(next) {
  try {
    // Only generate classString if it's not already set or if relevant fields have changed
    if (!this.isModified('batch') && !this.isModified('branch') && 
        !this.isModified('section') && !this.isModified('semester') && this.classString) {
      return next();
    }
    
    // Populate the referenced documents to access their names
    await this.populate([
      { path: 'batch', select: 'name' },
      { path: 'branch', select: 'name' },
      { path: 'section', select: 'name' }
    ]);
    
    // Generate the class string in the format: "3 sem CSE A"
    this.classString = `${this.semester} sem ${this.branch.name} ${this.section.name}`;
    
    next();
  } catch (error) {
    next(error);
  }
});

const Class = mongoose.model('Class', classSchema);
module.exports = Class;