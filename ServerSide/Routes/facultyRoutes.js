const express = require('express');
const { getAllFaculties, getFacultyById, createFaculty, updateFaculty, deleteFaculty } = require('../Controller/facultyController');

const router = express.Router();

router.get('/', getAllFaculties);

router.get('/:id', getFacultyById);

router.post('/', createFaculty);

router.put('/:id', updateFaculty);

router.delete('/:id', deleteFaculty);

module.exports = router;