const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../Middleware/auth');
const { checkRole } = require('../Middleware/roleCheck');
const {
  createNotice,
  getHODNotices,
  getFacultyNotices,
  getStudentNotices,
  markNoticeAsRead,
  updateNotice,
  deleteNotice,
  getNoticeStats
} = require('../Controller/noticeController');

// Apply authentication to all routes
router.use(authenticateToken);

// Create notice (HOD and Faculty only)
router.post('/', createNotice);

// Get notices based on role
router.get('/hod', getHODNotices);
router.get('/faculty', getFacultyNotices);
router.get('/student', getStudentNotices);

// Mark notice as read
router.put('/:noticeId/read', markNoticeAsRead);

// Update notice (only by sender)
router.put('/:noticeId', updateNotice);

// Delete notice (only by sender)
router.delete('/:noticeId', deleteNotice);

// Get notice statistics
router.get('/stats', getNoticeStats);

module.exports = router;
