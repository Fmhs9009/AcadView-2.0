// models/Faculty.js
import mongoose from 'mongoose';

const facultySchema = new mongoose.Schema({
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
    type: String,
    required: true,
  },
  assignedClasses: [
    {
      type: String, // ye dekhna hoga
    },
  ],
}, { timestamps: true });

const Faculty = mongoose.model('Faculty', facultySchema);
export default Faculty;
