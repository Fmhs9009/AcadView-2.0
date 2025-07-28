const express = require('express');
const router = express.Router();

// Import controllers
const {
  getAllClasses,
  getClassById,
  createClass,
  getOrCreateClass,
  generateClassString,
  updateClass,
  deleteClass
} = require('../Controller/classController');

// Define routes
router.get('/', getAllClasses);
router.get('/class-string', generateClassString);
router.get('/:id', getClassById);
router.post('/', createClass);
router.post('/get-or-create', getOrCreateClass);
router.put('/:id', updateClass);
router.delete('/:id', deleteClass);

module.exports = router;