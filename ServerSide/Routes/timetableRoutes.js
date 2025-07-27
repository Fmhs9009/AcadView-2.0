const express = require('express');
const router = express.Router();

// Import controllers
const {
  getAllTimetableEntries,
  getTimetableByClass,
  getTimetableByFaculty,
  createTimetableEntry,
  updateTimetableEntry,
  deleteTimetableEntry
} = require('../Controller/timetableController');

// Define routes
router.get('/', getAllTimetableEntries);
router.get('/class/:classId', getTimetableByClass);
router.get('/faculty/:facultyId', getTimetableByFaculty);
router.post('/', createTimetableEntry);
router.put('/:id', updateTimetableEntry);
router.delete('/:id', deleteTimetableEntry);

module.exports = router;