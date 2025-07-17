const express = require('express');
const router = express.Router();
const {
  getClassString,
  getOrCreateClass,
  getAllClasses,
  getClassesByFaculty,
  getStudentsInClass
} = require('../Controller/classController');

// Get class string based on batch, branch, and section IDs
router.get('/class-string', getClassString);

// Get or create a class
router.post('/get-or-create', getOrCreateClass);

// Get all classes
router.get('/', getAllClasses);

// Get classes by faculty
router.get('/faculty/:facultyId', getClassesByFaculty);

// Get students in a class
router.get('/:classId/students', getStudentsInClass);

module.exports = router;