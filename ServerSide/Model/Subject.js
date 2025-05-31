// models/Subject.js
const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    // course_id: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Course',
    //     required: true,
    // },
    subject_id:{
        type: String,
        required: true,
        unique: true
    },
    semester: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Semester',
        required: true,
    },
}, { timestamps: true })

const Subject = mongoose.model('Subject', subjectSchema);
module.exports = Subject;