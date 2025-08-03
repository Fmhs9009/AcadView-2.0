const express = require('express');
const router = express.Router();

// Import controllers
const {
  getAllTimetableEntries,
  getTimetableByClass,
  getTimetableByFaculty,
  createTimetableEntry,
  updateTimetableEntry,
  deleteTimetableEntry,
  getAllTimetableFiles,
  uploadTimetableFile,
  deleteTimetableFile,
  setTimetableAsCurrent,
  upload
} = require('../Controller/timetableController');

// Define routes for timetable entries
router.get('/', getAllTimetableEntries);
router.get('/class/:classId', getTimetableByClass);
router.get('/faculty/:facultyId', getTimetableByFaculty);
router.post('/', createTimetableEntry);
router.put('/:id', updateTimetableEntry);
router.delete('/:id', deleteTimetableEntry);

// Define routes for timetable files
router.get('/files', getAllTimetableFiles);
router.post('/upload', upload.single('file'), uploadTimetableFile);
router.delete('/files/:id', deleteTimetableFile);
router.patch('/:id/set-current', setTimetableAsCurrent);

module.exports = router;