const mongoose = require('mongoose');

const timeSlotSchema = new mongoose.Schema({
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
  },
  faculty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Faculty',
  },
  room: {
    type: String,
  },
  type: {
    type: String,
    enum: ['Lecture', 'Lab', 'Tutorial', 'Break'],
    default: 'Lecture',
  },
}, { _id: false });

const dayScheduleSchema = new mongoose.Schema({
  day: {
    type: String,
    required: true,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  },
  timeSlots: [timeSlotSchema],
}, { _id: false });

const timetableSchema = new mongoose.Schema({
  class: {
    type: String,
    required: true,
  },
  section: {
    type: String,
    required: true,
  },
  semester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Semester',
    required: true,
  },
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
    required: true,
  },
  academicYear: {
    type: String,
    required: true,
  },
  schedule: [dayScheduleSchema],
  isActive: {
    type: Boolean,
    default: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'HOD',
  },
}, {
  timestamps: true,
});

// Index for better query performance
timetableSchema.index({ class: 1, section: 1, academicYear: 1 });
timetableSchema.index({ branch: 1, semester: 1 });

module.exports = mongoose.model('Timetable', timetableSchema);
