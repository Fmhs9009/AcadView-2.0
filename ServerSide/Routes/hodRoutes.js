const express = require('express');
const { createHOD, getAllHODs, getHODById, updateHOD, deleteHOD } = require('../Controller/hodController');

const router = express.Router();

// Create HOD
router.post('/', createHOD);
// Get all HODs
router.get('/', getAllHODs);
// Get HOD by ID
router.get('/:id', getHODById);
// Update HOD
router.put('/:id', updateHOD);
// Delete HOD
router.delete('/:id', deleteHOD);

module.exports = router; 