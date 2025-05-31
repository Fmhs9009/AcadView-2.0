// models/Student.js
import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
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
  enrollmentNo: {
    type: String,
    required: true,
    unique: true,
  },
  semester: {
    type: Number,
    required: true,
  },
  branch: {
    type: String,
    required: true,
  },
  section: {
    type: String,
    required: true,
  },
  batch: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Student = mongoose.model('Student', studentSchema);
export default Student;
