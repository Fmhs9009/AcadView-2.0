import mongoose from "mongoose";

const facultyDetails = new mongoose.Schema({
  employeeId: {
    type: Number,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  middleName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: Number,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  experience: {
    type: Number,
    required: true,
  },
  post: {
    type: String,
    // required: true,
  },
  profile: {
    type: String,
    // required: true,
  }
}, { timestamps: true });

// module.exports = mongoose.model("Faculty Detail", facultyDetails);
export default mongoose.model("Faculty Detail", facultyDetails);
