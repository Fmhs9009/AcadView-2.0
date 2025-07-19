const StudyMaterial = require('../Model/StudyMaterial');
const Class = require('../Model/Class');
const Subject = require('../Model/Subject');
const Faculty = require('../Model/Faculty');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../public/uploads/study-materials');
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

const fileFilter = (req, file, cb) => {
  // Allow specific file types
  const allowedTypes = /pdf|doc|docx|ppt|pptx|txt|jpg|jpeg|png|zip|rar/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only specific file types are allowed (PDF, DOC, DOCX, PPT, PPTX, TXT, JPG, JPEG, PNG, ZIP, RAR)'));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  },
  fileFilter: fileFilter
});

// Upload study material
const uploadStudyMaterial = async (req, res) => {
  try {
    const { title, description, subjectId, classId, tags } = req.body;
    const uploadedBy = req.body.facultyId; // In real app, this would come from auth middleware

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    if (!title || !subjectId || !classId || !uploadedBy) {
      return res.status(400).json({
        success: false,
        message: 'Title, Subject, Class, and Faculty are required'
      });
    }

    // Verify that the class and subject exist
    const [classExists, subjectExists, facultyExists] = await Promise.all([
      Class.findById(classId),
      Subject.findById(subjectId),
      Faculty.findById(uploadedBy)
    ]);

    if (!classExists) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }

    if (!subjectExists) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
    }

    if (!facultyExists) {
      return res.status(404).json({
        success: false,
        message: 'Faculty not found'
      });
    }

    // Create study material record
    const studyMaterial = new StudyMaterial({
      title,
      description,
      fileUrl: `/uploads/study-materials/${req.file.filename}`,
      fileName: req.file.originalname,
      fileType: path.extname(req.file.originalname),
      fileSize: req.file.size,
      uploadedBy,
      subject: subjectId,
      class: classId,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : []
    });

    await studyMaterial.save();
    await studyMaterial.populate('uploadedBy subject class');

    res.status(201).json({
      success: true,
      message: 'Study material uploaded successfully',
      data: studyMaterial
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
      message: 'Failed to upload study material',
      error: err.message
    });
  }
};

// Get all study materials
const getAllStudyMaterials = async (req, res) => {
  try {
    const { page = 1, limit = 10, classId, subjectId, search } = req.query;
    
    let query = { isPublished: true };
    
    if (classId) query.class = classId;
    if (subjectId) query.subject = subjectId;
    if (search) {
      query.$text = { $search: search };
    }

    const studyMaterials = await StudyMaterial.find(query)
      .populate('uploadedBy', 'name email')
      .populate('subject', 'name code')
      .populate('class')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await StudyMaterial.countDocuments(query);

    res.status(200).json({
      success: true,
      count: studyMaterials.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: studyMaterials
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch study materials',
      error: err.message
    });
  }
};

// Get study materials by class
const getStudyMaterialsByClass = async (req, res) => {
  try {
    const { classId } = req.params;
    const { subjectId, search } = req.query;
    
    let query = { class: classId, isPublished: true };
    
    if (subjectId) query.subject = subjectId;
    if (search) {
      query.$text = { $search: search };
    }

    const studyMaterials = await StudyMaterial.find(query)
      .populate('uploadedBy', 'name email')
      .populate('subject', 'name code')
      .populate('class')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: studyMaterials.length,
      data: studyMaterials
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch study materials for class',
      error: err.message
    });
  }
};

// Get study materials by faculty
const getStudyMaterialsByFaculty = async (req, res) => {
  try {
    const { facultyId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const studyMaterials = await StudyMaterial.find({ uploadedBy: facultyId })
      .populate('subject', 'name code')
      .populate('class')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await StudyMaterial.countDocuments({ uploadedBy: facultyId });

    res.status(200).json({
      success: true,
      count: studyMaterials.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: studyMaterials
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch faculty study materials',
      error: err.message
    });
  }
};

// Get study material by ID
const getStudyMaterialById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const studyMaterial = await StudyMaterial.findById(id)
      .populate('uploadedBy', 'name email')
      .populate('subject', 'name code')
      .populate('class');

    if (!studyMaterial) {
      return res.status(404).json({
        success: false,
        message: 'Study material not found'
      });
    }

    // Increment view count
    studyMaterial.viewCount += 1;
    await studyMaterial.save();

    res.status(200).json({
      success: true,
      data: studyMaterial
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch study material',
      error: err.message
    });
  }
};

// Update study material
const updateStudyMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, tags, isPublished } = req.body;
    
    const studyMaterial = await StudyMaterial.findById(id);
    
    if (!studyMaterial) {
      return res.status(404).json({
        success: false,
        message: 'Study material not found'
      });
    }

    // Update fields
    if (title) studyMaterial.title = title;
    if (description !== undefined) studyMaterial.description = description;
    if (tags) studyMaterial.tags = tags.split(',').map(tag => tag.trim());
    if (isPublished !== undefined) studyMaterial.isPublished = isPublished;

    await studyMaterial.save();
    await studyMaterial.populate('uploadedBy subject class');

    res.status(200).json({
      success: true,
      message: 'Study material updated successfully',
      data: studyMaterial
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to update study material',
      error: err.message
    });
  }
};

// Delete study material
const deleteStudyMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    
    const studyMaterial = await StudyMaterial.findById(id);
    
    if (!studyMaterial) {
      return res.status(404).json({
        success: false,
        message: 'Study material not found'
      });
    }

    // Delete file from filesystem
    const filePath = path.join(__dirname, '../public', studyMaterial.fileUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await StudyMaterial.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Study material deleted successfully'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete study material',
      error: err.message
    });
  }
};

// Download study material
const downloadStudyMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    
    const studyMaterial = await StudyMaterial.findById(id);
    
    if (!studyMaterial) {
      return res.status(404).json({
        success: false,
        message: 'Study material not found'
      });
    }

    const filePath = path.join(__dirname, '../public', studyMaterial.fileUrl);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Increment download count
    studyMaterial.downloadCount += 1;
    await studyMaterial.save();

    res.download(filePath, studyMaterial.fileName);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to download study material',
      error: err.message
    });
  }
};

module.exports = {
  upload,
  uploadStudyMaterial,
  getAllStudyMaterials,
  getStudyMaterialsByClass,
  getStudyMaterialsByFaculty,
  getStudyMaterialById,
  updateStudyMaterial,
  deleteStudyMaterial,
  downloadStudyMaterial
};