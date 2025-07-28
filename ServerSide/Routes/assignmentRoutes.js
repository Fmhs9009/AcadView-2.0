const express = require('express');
const router = express.Router();

// Import controllers
// Note: We need to create the assignmentController.js file as well
const {
  getAllAssignments,
  getAssignmentById,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  getAssignmentsByClass,
  getAssignmentsByFaculty
} = require('../Controller/assignmentController');

// Define routes
router.get('/', getAllAssignments);
router.get('/:id', getAssignmentById);
router.post('/', createAssignment);
router.put('/:id', updateAssignment);
router.delete('/:id', deleteAssignment);
router.get('/class/:classId', getAssignmentsByClass);
router.get('/faculty/:facultyId', getAssignmentsByFaculty);

module.exports = router;