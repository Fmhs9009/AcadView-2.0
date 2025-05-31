// models/Admin.js
import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
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
//   role: {
//     type: String,
//     enum: ['Super Admin', 'Admin'],
//     default: 'Admin',
//   },
}, { timestamps: true });

const Admin = mongoose.model('Admin', adminSchema);
export default Admin;
