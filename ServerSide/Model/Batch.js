const mongoose = require('mongoose');

const batchSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
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

const Batch = mongoose.model('Batch', batchSchema);

module.exports = Batch;