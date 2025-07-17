const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../Middleware/auth');
const { checkRole } = require('../Middleware/roleCheck');
const {
  checkDepartmentAccess,
  getDepartmentFaculty,
  getDepartmentStudents,
  addFaculty,
  addStudent,
  removeFaculty,
  removeStudent,
  getDepartmentStats
} = require('../Controller/hodManagementController');

// Apply authentication and HOD role check to all routes
// router.use(authenticateToken);
// router.use(checkRole('hod'));
// router.use(checkDepartmentAccess);

// Faculty management routes
router.get('/faculty', getDepartmentFaculty);
router.post('/faculty', addFaculty);
router.delete('/faculty/:id', removeFaculty);

// Student management routes
router.get('/students', getDepartmentStudents);
router.post('/student', addStudent);
router.delete('/student/:id', removeStudent);

// Department statistics
router.get('/statistics', getDepartmentStats);

module.exports = router;