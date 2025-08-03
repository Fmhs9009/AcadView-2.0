const Timetable = require('../Model/Timetable');
const TimetableFile = require('../Model/TimetableFile');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads/timetables');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: function (req, file, cb) {
    // Check file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF and image files are allowed.'));
    }
  }
});

// Get all timetable entries
const getAllTimetableEntries = async (req, res) => {
  try {
    const timetable = await Timetable.find()
      .populate('subject')
      .populate('class')
      .populate('faculty', '-password');
    
    res.status(200).json({
      success: true,
      count: timetable.length,
      data: timetable
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch timetable entries',
      error: error.message
    });
  }
};

// Get timetable entries by class
const getTimetableByClass = async (req, res) => {
  try {
    const timetable = await Timetable.find({ class: req.params.classId })
      .populate('subject')
      .populate('faculty', '-password')
      .sort({ day: 1, startTime: 1 });
    
    res.status(200).json({
      success: true,
      count: timetable.length,
      data: timetable
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch timetable for class',
      error: error.message
    });
  }
};

// Get timetable entries by faculty
const getTimetableByFaculty = async (req, res) => {
  try {
    const timetable = await Timetable.find({ faculty: req.params.facultyId })
      .populate('subject')
      .populate('class')
      .sort({ day: 1, startTime: 1 });
    
    res.status(200).json({
      success: true,
      count: timetable.length,
      data: timetable
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch timetable for faculty',
      error: error.message
    });
  }
};

// Create a new timetable entry
const createTimetableEntry = async (req, res) => {
  try {
    const { day, startTime, endTime, room, subjectId, classId, facultyId } = req.body;

    // Check for time conflicts
    const conflictingEntry = await Timetable.findOne({
      day,
      class: classId,
      $or: [
        // New entry starts during an existing entry
        { startTime: { $lte: startTime }, endTime: { $gt: startTime } },
        // New entry ends during an existing entry
        { startTime: { $lt: endTime }, endTime: { $gte: endTime } },
        // New entry completely contains an existing entry
        { startTime: { $gte: startTime }, endTime: { $lte: endTime } }
      ]
    });

    if (conflictingEntry) {
      return res.status(400).json({
        success: false,
        message: 'Time conflict with existing timetable entry'
      });
    }

    const newTimetableEntry = new Timetable({
      day,
      startTime,
      endTime,
      room,
      subject: subjectId,
      class: classId,
      faculty: facultyId
    });

    await newTimetableEntry.save();

    res.status(201).json({
      success: true,
      data: newTimetableEntry
    });
  } catch (error) {
    // Check for duplicate key error (unique constraint violation)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A timetable entry already exists for this day, time, and class'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create timetable entry',
      error: error.message
    });
  }
};

// Update a timetable entry
const updateTimetableEntry = async (req, res) => {
  try {
    const timetableEntry = await Timetable.findById(req.params.id);
    
    if (!timetableEntry) {
      return res.status(404).json({
        success: false,
        message: 'Timetable entry not found'
      });
    }

    // Check for time conflicts if day, time, or class is being updated
    if (req.body.day || req.body.startTime || req.body.endTime || req.body.classId) {
      const day = req.body.day || timetableEntry.day;
      const startTime = req.body.startTime || timetableEntry.startTime;
      const endTime = req.body.endTime || timetableEntry.endTime;
      const classId = req.body.classId || timetableEntry.class;

      const conflictingEntry = await Timetable.findOne({
        _id: { $ne: req.params.id }, // Exclude the current entry
        day,
        class: classId,
        $or: [
          { startTime: { $lte: startTime }, endTime: { $gt: startTime } },
          { startTime: { $lt: endTime }, endTime: { $gte: endTime } },
          { startTime: { $gte: startTime }, endTime: { $lte: endTime } }
        ]
      });

      if (conflictingEntry) {
        return res.status(400).json({
          success: false,
          message: 'Time conflict with existing timetable entry'
        });
      }
    }

    // Update fields
    const updatedTimetableEntry = await Timetable.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: updatedTimetableEntry
    });
  } catch (error) {
    // Check for duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A timetable entry already exists for this day, time, and class'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update timetable entry',
      error: error.message
    });
  }
};

// Delete a timetable entry
const deleteTimetableEntry = async (req, res) => {
  try {
    const timetableEntry = await Timetable.findById(req.params.id);
    
    if (!timetableEntry) {
      return res.status(404).json({
        success: false,
        message: 'Timetable entry not found'
      });
    }

    await Timetable.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Timetable entry deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete timetable entry',
      error: error.message
    });
  }
};

// Get all timetable files
const getAllTimetableFiles = async (req, res) => {
  try {
    const timetableFiles = await TimetableFile.find()
      .populate('batch', 'name year')
      .populate('branch', 'name')
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: timetableFiles.length,
      data: timetableFiles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch timetable files',
      error: error.message
    });
  }
};

// Upload timetable file
const uploadTimetableFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const {
      title,
      description,
      batch,
      branch,
      section,
      type,
      status,
      effectiveDate
    } = req.body;

    // Create file URL
    const fileUrl = `/uploads/timetables/${req.file.filename}`;

    const timetableFile = new TimetableFile({
      title,
      description,
      fileName: req.file.originalname,
      filePath: req.file.path,
      fileUrl,
      fileSize: req.file.size,
      fileType: req.file.mimetype,
      type,
      status,
      effectiveDate: effectiveDate ? new Date(effectiveDate) : undefined,
      batch: batch || undefined,
      branch: branch || undefined,
      section: section || 'All',
      createdBy: req.user?.id || req.body.createdBy // Assuming user info is available
    });

    await timetableFile.save();

    // Populate the response
    await timetableFile.populate([
      { path: 'batch', select: 'name year' },
      { path: 'branch', select: 'name' },
      { path: 'createdBy', select: 'name' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Timetable file uploaded successfully',
      data: timetableFile
    });
  } catch (error) {
    // Delete uploaded file if database save fails
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to upload timetable file',
      error: error.message
    });
  }
};

// Delete timetable file
const deleteTimetableFile = async (req, res) => {
  try {
    const timetableFile = await TimetableFile.findById(req.params.id);
    
    if (!timetableFile) {
      return res.status(404).json({
        success: false,
        message: 'Timetable file not found'
      });
    }

    // Delete physical file
    if (fs.existsSync(timetableFile.filePath)) {
      fs.unlinkSync(timetableFile.filePath);
    }

    // Delete from database
    await TimetableFile.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Timetable file deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete timetable file',
      error: error.message
    });
  }
};

// Set timetable as current
const setTimetableAsCurrent = async (req, res) => {
  try {
    const timetableFile = await TimetableFile.findById(req.params.id);
    
    if (!timetableFile) {
      return res.status(404).json({
        success: false,
        message: 'Timetable file not found'
      });
    }

    // Set all other timetables of same type to not current
    await TimetableFile.updateMany(
      { 
        type: timetableFile.type,
        batch: timetableFile.batch,
        branch: timetableFile.branch,
        section: timetableFile.section
      },
      { status: 'future' }
    );

    // Set this timetable as current
    timetableFile.status = 'current';
    timetableFile.effectiveDate = new Date();
    await timetableFile.save();

    await timetableFile.populate([
      { path: 'batch', select: 'name year' },
      { path: 'branch', select: 'name' },
      { path: 'createdBy', select: 'name' }
    ]);

    res.status(200).json({
      success: true,
      message: 'Timetable set as current successfully',
      data: timetableFile
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to set timetable as current',
      error: error.message
    });
  }
};

module.exports = {
  getAllTimetableEntries,
  getTimetableByClass,
  getTimetableByFaculty,
  createTimetableEntry,
  updateTimetableEntry,
  deleteTimetableEntry,
  getAllTimetableFiles,
  uploadTimetableFile,
  deleteTimetableFile,
  setTimetableAsCurrent,
  upload // Export multer middleware
};