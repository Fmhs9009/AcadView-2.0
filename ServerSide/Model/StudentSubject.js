
// models/StudentSubject.js
import mongoose from 'mongoose';

const studentSubjectSchema = new mongoose.Schema({
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  branch_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
    required: true,
  },
  subject_id: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Subject',
            required: true,
        }
    ]
}, { timestamps: true });

const StudentSubject = mongoose.model('StudentSubject', studentSubjectSchema);
export default StudentSubject;
