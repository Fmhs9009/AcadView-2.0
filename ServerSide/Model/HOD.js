const mongoose = require('mongoose');

const hodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNo: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true,
  },
  empId: {
    type: String,
    required: true,
    unique: true,
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
    required: true,
  },
  designation: {
    type: String,
    default: 'Head of Department',
  },
  isActive: {
    type: Boolean,
    default: true,
    unique: true, // har dept. ka ek hi HOD hota hai
  },
  departmentFaculty: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Faculty',
    },
  ],
}, { timestamps: true });

const HOD = mongoose.model('HOD', hodSchema);
module.exports = HOD;
