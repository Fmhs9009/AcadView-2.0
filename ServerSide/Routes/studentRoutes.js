const express = require('express');
const {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentsByFilter
} = require('../Controller/studentController');

const router = express.Router();

// Get all students or filter by query parameters
router.get('/', getStudentsByFilter);

// Get a specific student by ID
router.get('/:id', getStudentById);

// Create a new student
router.post('/', createStudent);

// Update a student
router.put('/:id', updateStudent);

// Delete a student
router.delete('/:id', deleteStudent);

module.exports = router;
