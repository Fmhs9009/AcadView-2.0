import mongoose from "mongoose";

const adminCredential = new mongoose.Schema({
  loginid: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
}, { timestamps: true });

export default mongoose.model("Admin Credential", adminCredential);
