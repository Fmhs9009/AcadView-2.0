const express = require('express');
const {
  getAllSemesters,
  getSemesterById,
  createSemester,
  updateSemester,
  deleteSemester
} = require('../Controller/semesterController');

const router = express.Router();

// Get all semesters
router.get('/', getAllSemesters);

// Get a specific semester by ID
router.get('/:id', getSemesterById);

// Create a new semester
router.post('/', createSemester);

// Update a semester
router.put('/:id', updateSemester);

// Delete a semester
router.delete('/:id', deleteSemester);

module.exports = router;
