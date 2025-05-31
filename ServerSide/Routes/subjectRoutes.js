const express = require('express');
const { getAllSubject, getSubjectById, createSubject, updateSubject, deleteSubject } = require('../Controller/subjectController');

const router = express.Router();

// Get all subject
router.get('/', getAllSubject);

// Get subject by id
router.get('/:id', getSubjectById)

// Create new subject
router.post('/', createSubject);

router.put('/:id', updateSubject);

// delete subject
router.delete('/:id', deleteSubject);

module.exports = router;