// models/Batch.js
const mongoose = require('mongoose');

const batchSchema = new mongoose.Schema({
  name: {
    type: String,
    // required: true,
    // unique: true
  },
  startYear: {
    type: Number,
    required: true
  },
  endYear: {
    type: Number,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// Method to get the current semester based on batch and current date
batchSchema.methods.getCurrentSemester = function() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-indexed
  
  // Calculate years passed since batch started
  let yearsPassed = currentYear - this.startYear;
  
  // Adjust for academic year (assuming academic year starts in July)
  // If current month is before July, we're in the second half of the academic year
  // If current month is July or later, we're in the first half of the next academic year
  let semester;
  
  if (currentMonth < 7) { // January to June
    semester = yearsPassed * 2;
  } else { // July to December
    semester = yearsPassed * 2 + 1;
  }
  
  return Math.min(Math.max(semester, 1), 8); // Ensure semester is between 1 and 8
};

const Batch = mongoose.model('Batch', batchSchema);
module.exports = Batch;