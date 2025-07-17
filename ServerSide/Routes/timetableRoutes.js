const express = require('express');
const router = express.Router();
const {
  upload,
  createTimetable,
  getAllTimetables,
  getTimetablesByClass,
  getCurrentTimetable,
  getTimetablesByFaculty,
  getTimetableById,
  updateTimetable,
  deleteTimetable,
  downloadTimetable
} = require('../Controller/timetableController');

// Create timetable with file upload
router.post('/', upload.single('file'), createTimetable);

// Get all timetables with filtering
router.get('/', getAllTimetables);

// Get timetables by class
router.get('/class/:classId', getTimetablesByClass);

// Get current active timetable for a class
router.get('/class/:classId/current', getCurrentTimetable);

// Get timetables by faculty
router.get('/faculty/:facultyId', getTimetablesByFaculty);

// Get timetable by ID
router.get('/:id', getTimetableById);

// Update timetable
router.put('/:id', updateTimetable);

// Delete timetable
router.delete('/:id', deleteTimetable);

// Download timetable file
router.get('/:id/download', downloadTimetable);

module.exports = router;