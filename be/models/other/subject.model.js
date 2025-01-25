import mongoose from "mongoose";

const subjectDetails = new mongoose.Schema({
    subjectName: { 
        type: String,
        required: true 
    },
    subjectCode: { 
        type: String, 
        required: true, 
        unique: true 
    },
    
}, { timestamps: true });

export default mongoose.model("Subject Detail", subjectDetails);
