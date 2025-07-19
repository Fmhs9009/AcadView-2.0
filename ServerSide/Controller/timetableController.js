const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Timetable Schema
const timetableSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  academicYear: {
    type: String,
    required: true
  },
  semester: {
    type: String,
    required: true,
    enum: ['1', '2', '3', '4', '5', '6', '7', '8']
  },
  effectiveFrom: {
    type: Date,
    required: true
  },
  effectiveTo: {
    type: Date
  },
  fileUrl: {
    type: String
  },
  fileName: {
    type: String
  },
  fileType: {
    type: String
  },
  fileSize: {
    type: Number
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Faculty',
    required: true
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  timetableType: {
    type: String,
    enum: ['regular', 'exam', 'special'],
    default: 'regular'
  },
  // Optional: Structured timetable data
  schedule: [{
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      required: true
    },
    periods: [{
      startTime: {
        type: String,
        required: true
      },
      endTime: {
        type: String,
        required: true
      },
      subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject'
      },
      faculty: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Faculty'
      },
      room: {
        type: String
      },
      periodType: {
        type: String,
        enum: ['lecture', 'lab', 'tutorial', 'break'],
        default: 'lecture'
      }
    }]
  }],
  viewCount: {
    type: Number,
    default: 0
  },
  downloadCount: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// Create index for efficient queries
timetableSchema.index({ class: 1, academicYear: 1, semester: 1 });
timetableSchema.index({ effectiveFrom: 1, effectiveTo: 1 });

// Create Timetable model
const Timetable = mongoose.model('Timetable', timetableSchema);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../public/uploads/timetables');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /pdf|jpg|jpeg|png|doc|docx|xls|xlsx/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only PDF, images, and document files are allowed'));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: fileFilter
});

// Create timetable
const createTimetable = async (req, res) => {
  try {
    const {
      title,
      description,
      academicYear,
      semester,
      effectiveFrom,
      effectiveTo,
      classId,
      timetableType,
      schedule
    } = req.body;
    
    const uploadedBy = req.body.facultyId; // In real app, this would come from auth middleware

    if (!title || !academicYear || !semester || !effectiveFrom || !classId || !uploadedBy) {
      return res.status(400).json({
        success: false,
        message: 'Title, Academic Year, Semester, Effective From, Class, and Faculty are required'
      });
    }

    const timetableData = {
      title,
      description,
      academicYear,
      semester,
      effectiveFrom: new Date(effectiveFrom),
      effectiveTo: effectiveTo ? new Date(effectiveTo) : null,
      uploadedBy,
      class: classId,
      timetableType: timetableType || 'regular'
    };

    // Add structured schedule if provided
    if (schedule) {
      try {
        timetableData.schedule = typeof schedule === 'string' ? JSON.parse(schedule) : schedule;
      } catch (err) {
        return res.status(400).json({
          success: false,
          message: 'Invalid schedule format'
        });
      }
    }

    // Add file details if uploaded
    if (req.file) {
      timetableData.fileUrl = `/uploads/timetables/${req.file.filename}`;
      timetableData.fileName = req.file.originalname;
      timetableData.fileType = path.extname(req.file.originalname);
      timetableData.fileSize = req.file.size;
    }

    const timetable = new Timetable(timetableData);
    await timetable.save();
    await timetable.populate('uploadedBy class');

    res.status(201).json({
      success: true,
      message: 'Timetable created successfully',
      data: timetable
    });
  } catch (err) {
    // Delete uploaded file if database save fails
    if (req.file) {
      fs.unlink(req.file.path, (unlinkErr) => {
        if (unlinkErr) console.error('Error deleting file:', unlinkErr);
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create timetable',
      error: err.message
    });
  }
};

// Get all timetables
const getAllTimetables = async (req, res) => {
  try {
    const { page = 1, limit = 10, classId, academicYear, semester, timetableType, active } = req.query;
    
    let query = { isPublished: true };
    
    if (classId) query.class = classId;
    if (academicYear) query.academicYear = academicYear;
    if (semester) query.semester = semester;
    if (timetableType) query.timetableType = timetableType;
    if (active !== undefined) query.isActive = active === 'true';

    const timetables = await Timetable.find(query)
      .populate('uploadedBy', 'name email')
      .populate('class')
      .populate('schedule.subject', 'name code')
      .populate('schedule.periods.faculty', 'name')
      .sort({ effectiveFrom: -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Timetable.countDocuments(query);

    res.status(200).json({
      success: true,
      count: timetables.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: timetables
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch timetables',
      error: err.message
    });
  }
};

// Get timetables by class
const getTimetablesByClass = async (req, res) => {
  try {
    const { classId } = req.params;
    const { academicYear, semester, timetableType, current } = req.query;
    
    let query = { class: classId, isPublished: true, isActive: true };
    
    if (academicYear) query.academicYear = academicYear;
    if (semester) query.semester = semester;
    if (timetableType) query.timetableType = timetableType;
    
    if (current === 'true') {
      const now = new Date();
      query.effectiveFrom = { $lte: now };
      query.$or = [
        { effectiveTo: { $gte: now } },
        { effectiveTo: null }
      ];
    }

    const timetables = await Timetable.find(query)
      .populate('uploadedBy', 'name email')
      .populate('class')
      .populate('schedule.subject', 'name code')
      .populate('schedule.periods.faculty', 'name')
      .sort({ effectiveFrom: -1 });

    res.status(200).json({
      success: true,
      count: timetables.length,
      data: timetables
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch timetables for class',
      error: err.message
    });
  }
};

// Get current active timetable for a class
const getCurrentTimetable = async (req, res) => {
  try {
    const { classId } = req.params;
    const { timetableType = 'regular' } = req.query;
    
    const now = new Date();
    
    const timetable = await Timetable.findOne({
      class: classId,
      isPublished: true,
      isActive: true,
      timetableType,
      effectiveFrom: { $lte: now },
      $or: [
        { effectiveTo: { $gte: now } },
        { effectiveTo: null }
      ]
    })
      .populate('uploadedBy', 'name email')
      .populate('class')
      .populate('schedule.subject', 'name code')
      .populate('schedule.periods.faculty', 'name')
      .sort({ effectiveFrom: -1 });

    if (!timetable) {
      return res.status(404).json({
        success: false,
        message: 'No active timetable found for this class'
      });
    }

    // Increment view count
    timetable.viewCount += 1;
    await timetable.save();

    res.status(200).json({
      success: true,
      data: timetable
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch current timetable',
      error: err.message
    });
  }
};

// Get timetables by faculty
const getTimetablesByFaculty = async (req, res) => {
  try {
    const { facultyId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const timetables = await Timetable.find({ uploadedBy: facultyId })
      .populate('class')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Timetable.countDocuments({ uploadedBy: facultyId });

    res.status(200).json({
      success: true,
      count: timetables.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: timetables
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch faculty timetables',
      error: err.message
    });
  }
};

// Get timetable by ID
const getTimetableById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const timetable = await Timetable.findById(id)
      .populate('uploadedBy', 'name email')
      .populate('class')
      .populate('schedule.subject', 'name code')
      .populate('schedule.periods.faculty', 'name');

    if (!timetable) {
      return res.status(404).json({
        success: false,
        message: 'Timetable not found'
      });
    }

    // Increment view count
    timetable.viewCount += 1;
    await timetable.save();

    res.status(200).json({
      success: true,
      data: timetable
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch timetable',
      error: err.message
    });
  }
};

// Update timetable
const updateTimetable = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const timetable = await Timetable.findById(id);
    
    if (!timetable) {
      return res.status(404).json({
        success: false,
        message: 'Timetable not found'
      });
    }

    // Parse schedule if provided
    if (updateData.schedule && typeof updateData.schedule === 'string') {
      try {
        updateData.schedule = JSON.parse(updateData.schedule);
      } catch (err) {
        return res.status(400).json({
          success: false,
          message: 'Invalid schedule format'
        });
      }
    }

    // Update timetable
    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        timetable[key] = updateData[key];
      }
    });

    await timetable.save();
    await timetable.populate('uploadedBy class');

    res.status(200).json({
      success: true,
      message: 'Timetable updated successfully',
      data: timetable
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to update timetable',
      error: err.message
    });
  }
};

// Delete timetable
const deleteTimetable = async (req, res) => {
  try {
    const { id } = req.params;
    
    const timetable = await Timetable.findById(id);
    
    if (!timetable) {
      return res.status(404).json({
        success: false,
        message: 'Timetable not found'
      });
    }

    // Delete file from filesystem if exists
    if (timetable.fileUrl) {
      const filePath = path.join(__dirname, '../public', timetable.fileUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await Timetable.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Timetable deleted successfully'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete timetable',
      error: err.message
    });
  }
};

// Download timetable file
const downloadTimetable = async (req, res) => {
  try {
    const { id } = req.params;
    
    const timetable = await Timetable.findById(id);
    
    if (!timetable || !timetable.fileUrl) {
      return res.status(404).json({
        success: false,
        message: 'Timetable file not found'
      });
    }

    const filePath = path.join(__dirname, '../public', timetable.fileUrl);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Increment download count
    timetable.downloadCount += 1;
    await timetable.save();

    res.download(filePath, timetable.fileName);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to download timetable',
      error: err.message
    });
  }
};

module.exports = {
  Timetable,
  upload,
  createTimetable,
  getAllTimetables,
  getTimetablesByClass,
  getCurrentTimetable,
  getTimetablesByFaculty,
  getTimetableById,
  updateTimetable,
  deleteTimetable,
  downloadTimetable
};