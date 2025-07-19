const express = require('express');
const router = express.Router();
const {
  upload,
  createAssignment,
  getAllAssignments,
  getAssignmentsByClass,
  getAssignmentsByFaculty,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
  downloadAssignment
} = require('../Controller/assignmentController');

// Create assignment with file upload
router.post('/', upload.single('file'), createAssignment);

// Get all assignments with filtering
router.get('/', getAllAssignments);

// Get assignments by class
router.get('/class/:classId', getAssignmentsByClass);

// Get assignments by faculty
router.get('/faculty/:facultyId', getAssignmentsByFaculty);

// Get assignment by ID
router.get('/:id', getAssignmentById);

// Update assignment
router.put('/:id', updateAssignment);

// Delete assignment
router.delete('/:id', deleteAssignment);

// Download assignment file
router.get('/:id/download', downloadAssignment);

module.exports = router;