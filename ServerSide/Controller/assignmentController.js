const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Assignment Schema
const assignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  instructions: {
    type: String,
    trim: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  maxMarks: {
    type: Number,
    required: true,
    min: 1
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
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  allowLateSubmission: {
    type: Boolean,
    default: false
  },
  latePenalty: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  submissionFormat: {
    type: [String],
    default: ['pdf', 'doc', 'docx']
  },
  submissions: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student'
    },
    submittedAt: {
      type: Date,
      default: Date.now
    },
    fileUrl: String,
    fileName: String,
    marks: {
      type: Number,
      min: 0
    },
    feedback: String,
    isLate: {
      type: Boolean,
      default: false
    }
  }]
}, { timestamps: true });

// Create Assignment model
const Assignment = mongoose.model('Assignment', assignmentSchema);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../public/uploads/assignments');
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
  const allowedTypes = /pdf|doc|docx|ppt|pptx|txt|jpg|jpeg|png|zip|rar/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only specific file types are allowed'));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  },
  fileFilter: fileFilter
});

// Create assignment
const createAssignment = async (req, res) => {
  try {
    const {
      title,
      description,
      instructions,
      dueDate,
      maxMarks,
      subjectId,
      classId,
      allowLateSubmission,
      latePenalty,
      submissionFormat
    } = req.body;
    
    const uploadedBy = req.body.facultyId; // In real app, this would come from auth middleware

    if (!title || !dueDate || !maxMarks || !subjectId || !classId || !uploadedBy) {
      return res.status(400).json({
        success: false,
        message: 'Title, Due Date, Max Marks, Subject, Class, and Faculty are required'
      });
    }

    const assignmentData = {
      title,
      description,
      instructions,
      dueDate: new Date(dueDate),
      maxMarks: parseInt(maxMarks),
      uploadedBy,
      subject: subjectId,
      class: classId,
      allowLateSubmission: allowLateSubmission === 'true',
      latePenalty: latePenalty ? parseInt(latePenalty) : 0,
      submissionFormat: submissionFormat ? submissionFormat.split(',').map(f => f.trim()) : ['pdf', 'doc', 'docx']
    };

    // Add file details if uploaded
    if (req.file) {
      assignmentData.fileUrl = `/uploads/assignments/${req.file.filename}`;
      assignmentData.fileName = req.file.originalname;
      assignmentData.fileType = path.extname(req.file.originalname);
      assignmentData.fileSize = req.file.size;
    }

    const assignment = new Assignment(assignmentData);
    await assignment.save();
    await assignment.populate('uploadedBy subject class');

    res.status(201).json({
      success: true,
      message: 'Assignment created successfully',
      data: assignment
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
      message: 'Failed to create assignment',
      error: err.message
    });
  }
};

// Get all assignments
const getAllAssignments = async (req, res) => {
  try {
    const { page = 1, limit = 10, classId, subjectId, facultyId } = req.query;
    
    let query = { isPublished: true };
    
    if (classId) query.class = classId;
    if (subjectId) query.subject = subjectId;
    if (facultyId) query.uploadedBy = facultyId;

    const assignments = await Assignment.find(query)
      .populate('uploadedBy', 'name email')
      .populate('subject', 'name code')
      .populate('class')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Assignment.countDocuments(query);

    res.status(200).json({
      success: true,
      count: assignments.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: assignments
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch assignments',
      error: err.message
    });
  }
};

// Get assignments by class
const getAssignmentsByClass = async (req, res) => {
  try {
    const { classId } = req.params;
    const { subjectId, upcoming, overdue } = req.query;
    
    let query = { class: classId, isPublished: true };
    
    if (subjectId) query.subject = subjectId;
    
    if (upcoming === 'true') {
      query.dueDate = { $gte: new Date() };
    }
    
    if (overdue === 'true') {
      query.dueDate = { $lt: new Date() };
    }

    const assignments = await Assignment.find(query)
      .populate('uploadedBy', 'name email')
      .populate('subject', 'name code')
      .populate('class')
      .sort({ dueDate: 1 });

    res.status(200).json({
      success: true,
      count: assignments.length,
      data: assignments
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch assignments for class',
      error: err.message
    });
  }
};

// Get assignments by faculty
const getAssignmentsByFaculty = async (req, res) => {
  try {
    const { facultyId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const assignments = await Assignment.find({ uploadedBy: facultyId })
      .populate('subject', 'name code')
      .populate('class')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Assignment.countDocuments({ uploadedBy: facultyId });

    res.status(200).json({
      success: true,
      count: assignments.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: assignments
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch faculty assignments',
      error: err.message
    });
  }
};

// Get assignment by ID
const getAssignmentById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const assignment = await Assignment.findById(id)
      .populate('uploadedBy', 'name email')
      .populate('subject', 'name code')
      .populate('class')
      .populate('submissions.student', 'name enrollmentNo');

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    res.status(200).json({
      success: true,
      data: assignment
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch assignment',
      error: err.message
    });
  }
};

// Update assignment
const updateAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const assignment = await Assignment.findById(id);
    
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    // Update assignment
    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        assignment[key] = updateData[key];
      }
    });

    await assignment.save();
    await assignment.populate('uploadedBy subject class');

    res.status(200).json({
      success: true,
      message: 'Assignment updated successfully',
      data: assignment
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to update assignment',
      error: err.message
    });
  }
};

// Delete assignment
const deleteAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    
    const assignment = await Assignment.findById(id);
    
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    // Delete file from filesystem if exists
    if (assignment.fileUrl) {
      const filePath = path.join(__dirname, '../public', assignment.fileUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await Assignment.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Assignment deleted successfully'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete assignment',
      error: err.message
    });
  }
};

// Download assignment file
const downloadAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    
    const assignment = await Assignment.findById(id);
    
    if (!assignment || !assignment.fileUrl) {
      return res.status(404).json({
        success: false,
        message: 'Assignment file not found'
      });
    }

    const filePath = path.join(__dirname, '../public', assignment.fileUrl);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    res.download(filePath, assignment.fileName);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to download assignment',
      error: err.message
    });
  }
};

module.exports = {
  Assignment,
  upload,
  createAssignment,
  getAllAssignments,
  getAssignmentsByClass,
  getAssignmentsByFaculty,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
  downloadAssignment
};