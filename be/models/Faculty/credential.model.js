import mongoose from "mongoose";

const facultyCredential = new mongoose.Schema({
  loginid: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  }
}, { timestamps: true });

export default mongoose.model("FacultyCredential", facultyCredential);
