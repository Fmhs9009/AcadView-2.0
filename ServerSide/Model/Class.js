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
    type: String,
    required: true
  },
  classString: {
    type: String,
    required: true,
    unique: true
  }
}, { timestamps: true });

const Class = mongoose.model('Class', classSchema);

module.exports = Class;