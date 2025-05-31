// models/Subject.js
import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    course_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
    },
    semester_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Semester',
        required: true,
    },
}, { timestamps: true })

const Subject = mongoose.model('Subject', subjectSchema);
export default Subject;