const Notice = require('../Model/Notice');
const HOD = require('../Model/HOD');
const Faculty = require('../Model/Faculty');
const Student = require('../Model/Student');

// Create a new notice (HOD or Faculty)
const createNotice = async (req, res) => {
  try {
    const { title, message, audience, targetBatch, targetSection, priority, expirationDate } = req.body;
    const { userId, userRole } = req.user || { userId: 'temp', userRole: 'HOD' }; // Temporary for testing

    // Validate audience based on role
    if (userRole === 'Faculty' && (audience === 'faculty' || audience === 'both')) {
      return res.status(403).json({ 
        message: 'Faculty can only send notices to students' 
      });
    }

    // Get sender information
    let sender, senderName, senderDepartment;
    if (userRole === 'HOD') {
      sender = await HOD.findById(userId);
      senderName = sender?.name || 'HOD';
      senderDepartment = sender?.department || 'Computer Science';
    } else if (userRole === 'Faculty') {
      sender = await Faculty.findById(userId);
      senderName = sender?.name || 'Faculty';
      senderDepartment = sender?.department || 'Computer Science';
    }

    const notice = new Notice({
      title,
      message,
      sender: userId,
      senderModel: userRole,
      senderName,
      senderDepartment,
      audience,
      targetBatch,
      targetSection,
      priority: priority || 'medium',
      expirationDate: expirationDate ? new Date(expirationDate) : null
    });

    await notice.save();
    res.status(201).json({
      message: 'Notice created successfully',
      notice
    });
  } catch (error) {
    console.error('Error creating notice:', error);
    res.status(500).json({ 
      message: 'Error creating notice', 
      error: error.message 
    });
  }
};

// Get notices for HOD (sent and received)
const getHODNotices = async (req, res) => {
  try {
    const { type, audience, page = 1, limit = 10 } = req.query;
    const { userId } = req.user || { userId: 'temp' }; // Temporary for testing
    
    let query = {};
    
    if (type === 'sent') {
      // Notices sent by this HOD
      query.sender = userId;
      query.senderModel = 'HOD';
    } else if (type === 'received') {
      // Notices received by this HOD (from other HODs or Faculty)
      query = {
        $and: [
          { sender: { $ne: userId } },
          {
            $or: [
              { audience: 'faculty' },
              { audience: 'both' }
            ]
          }
        ]
      };
    } else {
      // All notices (sent and received)
      query = {
        $or: [
          { sender: userId, senderModel: 'HOD' },
          {
            $and: [
              { sender: { $ne: userId } },
              {
                $or: [
                  { audience: 'faculty' },
                  { audience: 'both' }
                ]
              }
            ]
          }
        ]
      };
    }

    // Filter by audience if specified
    if (audience && type !== 'received') {
      query.audience = audience;
    }

    // Only active notices
    query.isActive = true;

    const notices = await Notice.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('sender', 'name department')
      .exec();

    const total = await Notice.countDocuments(query);

    res.json({
      notices,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching notices', 
      error: error.message 
    });
  }
};

// Get notices for Faculty (sent and received)
const getFacultyNotices = async (req, res) => {
  try {
    const { type, batch, section, page = 1, limit = 10 } = req.query;
    const { userId } = req.user || { userId: 'temp' }; // Temporary for testing
    
    let query = {};
    
    if (type === 'sent') {
      // Notices sent by this Faculty
      query.sender = userId;
      query.senderModel = 'Faculty';
    } else if (type === 'received') {
      // Notices received by this Faculty (from HODs)
      query = {
        $and: [
          { sender: { $ne: userId } },
          {
            $or: [
              { audience: 'faculty' },
              { audience: 'both' }
            ]
          }
        ]
      };
    } else {
      // All notices (sent and received)
      query = {
        $or: [
          { sender: userId, senderModel: 'Faculty' },
          {
            $and: [
              { sender: { $ne: userId } },
              {
                $or: [
                  { audience: 'faculty' },
                  { audience: 'both' }
                ]
              }
            ]
          }
        ]
      };
    }

    // Filter by batch and section for sent notices
    if (type === 'sent' && batch) {
      query.targetBatch = batch;
    }
    if (type === 'sent' && section) {
      query.targetSection = section;
    }

    // Only active notices
    query.isActive = true;

    const notices = await Notice.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('sender', 'name department')
      .exec();

    const total = await Notice.countDocuments(query);

    res.json({
      notices,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching notices', 
      error: error.message 
    });
  }
};

// Get notices for Students (received only)
const getStudentNotices = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const { userId } = req.user || { userId: 'temp' }; // Temporary for testing
    
    // Get student info to filter notices
    const student = await Student.findById(userId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const query = {
      $and: [
        { isActive: true },
        {
          $or: [
            { audience: 'students' },
            { audience: 'both' }
          ]
        },
        {
          $or: [
            { targetBatch: null },
            { targetBatch: student.batch }
          ]
        },
        {
          $or: [
            { targetSection: null },
            { targetSection: student.section }
          ]
        }
      ]
    };

    const notices = await Notice.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('sender', 'name department')
      .exec();

    const total = await Notice.countDocuments(query);

    res.json({
      notices,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching notices', 
      error: error.message 
    });
  }
};

// Mark notice as read
const markNoticeAsRead = async (req, res) => {
  try {
    const { noticeId } = req.params;
    const { userId, userRole } = req.user || { userId: 'temp', userRole: 'HOD' }; // Temporary for testing

    const notice = await Notice.findById(noticeId);
    if (!notice) {
      return res.status(404).json({ message: 'Notice not found' });
    }

    notice.markAsRead(userId, userRole);
    await notice.save();

    res.json({ message: 'Notice marked as read' });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error marking notice as read', 
      error: error.message 
    });
  }
};

// Update notice (only by sender)
const updateNotice = async (req, res) => {
  try {
    const { noticeId } = req.params;
    const { title, message, priority, expirationDate } = req.body;
    const { userId } = req.user || { userId: 'temp' }; // Temporary for testing

    const notice = await Notice.findById(noticeId);
    if (!notice) {
      return res.status(404).json({ message: 'Notice not found' });
    }

    // Check if user is the sender
    if (notice.sender.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'You can only update your own notices' });
    }

    // Update fields
    if (title) notice.title = title;
    if (message) notice.message = message;
    if (priority) notice.priority = priority;
    if (expirationDate !== undefined) {
      notice.expirationDate = expirationDate ? new Date(expirationDate) : null;
    }

    await notice.save();
    res.json({ message: 'Notice updated successfully', notice });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error updating notice', 
      error: error.message 
    });
  }
};

// Delete notice (only by sender)
const deleteNotice = async (req, res) => {
  try {
    const { noticeId } = req.params;
    const { userId } = req.user || { userId: 'temp' }; // Temporary for testing

    const notice = await Notice.findById(noticeId);
    if (!notice) {
      return res.status(404).json({ message: 'Notice not found' });
    }

    // Check if user is the sender
    if (notice.sender.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'You can only delete your own notices' });
    }

    // Soft delete - mark as inactive
    notice.isActive = false;
    await notice.save();

    res.json({ message: 'Notice deleted successfully' });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error deleting notice', 
      error: error.message 
    });
  }
};

// Get notice statistics
const getNoticeStats = async (req, res) => {
  try {
    const { userId, userRole } = req.user || { userId: 'temp', userRole: 'HOD' }; // Temporary for testing

    let stats = {};

    if (userRole === 'HOD') {
      const sentCount = await Notice.countDocuments({ 
        sender: userId, 
        senderModel: 'HOD', 
        isActive: true 
      });
      
      const receivedCount = await Notice.countDocuments({
        $and: [
          { sender: { $ne: userId } },
          { isActive: true },
          {
            $or: [
              { audience: 'faculty' },
              { audience: 'both' }
            ]
          }
        ]
      });

      stats = { sent: sentCount, received: receivedCount };
    } else if (userRole === 'Faculty') {
      const sentCount = await Notice.countDocuments({ 
        sender: userId, 
        senderModel: 'Faculty', 
        isActive: true 
      });
      
      const receivedCount = await Notice.countDocuments({
        $and: [
          { sender: { $ne: userId } },
          { isActive: true },
          {
            $or: [
              { audience: 'faculty' },
              { audience: 'both' }
            ]
          }
        ]
      });

      stats = { sent: sentCount, received: receivedCount };
    }

    res.json(stats);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching notice statistics', 
      error: error.message 
    });
  }
};

module.exports = {
  createNotice,
  getHODNotices,
  getFacultyNotices,
  getStudentNotices,
  markNoticeAsRead,
  updateNotice,
  deleteNotice,
  getNoticeStats
};
