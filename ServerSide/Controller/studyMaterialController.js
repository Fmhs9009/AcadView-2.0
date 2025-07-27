const StudyMaterial = require('../Model/StudyMaterial');
const Class = require('../Model/Class');
const Subject = require('../Model/Subject');
const Faculty = require('../Model/Faculty');
const fs = require('fs');
const path = require('path');

// Get all study materials
const getAllStudyMaterials = async (req, res) => {
  try {
    const studyMaterials = await StudyMaterial.find()
      .populate('subject', 'name code')
      .populate('class', 'classString')
      .populate('faculty', 'name email')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: studyMaterials.length,
      data: studyMaterials
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch study materials',
      error: error.message
    });
  }
};

// Get a single study material by ID
const getStudyMaterialById = async (req, res) => {
  try {
    const studyMaterial = await StudyMaterial.findById(req.params.id)
      .populate('subject', 'name code')
      .populate('class', 'classString')
      .populate('faculty', 'name email');
    
    if (!studyMaterial) {
      return res.status(404).json({
        success: false,
        message: 'Study material not found'
      });
    }

    res.status(200).json({
      success: true,
      data: studyMaterial
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch study material',
      error: error.message
    });
  }
};

// Create a new study material
const createStudyMaterial = async (req, res) => {
  try {
    const { title, description, subjectId, classId, materialType } = req.body;
    
    // Validate required fields
    if (!title || !subjectId || !classId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, subject, and class'
      });
    }

    // Check if subject exists
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
    }

    // Check if class exists
    const classObj = await Class.findById(classId);
    if (!classObj) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }

    // Create new study material object
    const newStudyMaterial = new StudyMaterial({
      title,
      description,
      subject: subjectId,
      class: classId,
      faculty: req.user.id, // Assuming user is authenticated and req.user contains faculty info
      materialType: materialType || 'notes'
    });

    // If file is uploaded, add file URL
    if (req.file) {
      newStudyMaterial.fileUrl = `/uploads/study-materials/${req.file.filename}`;
      newStudyMaterial.fileName = req.file.originalname;
      newStudyMaterial.fileType = req.file.mimetype;
      newStudyMaterial.fileSize = req.file.size;
    }

    await newStudyMaterial.save();

    res.status(201).json({
      success: true,
      data: newStudyMaterial
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create study material',
      error: error.message
    });
  }
};

// Update a study material
const updateStudyMaterial = async (req, res) => {
  try {
    const studyMaterial = await StudyMaterial.findById(req.params.id);
    
    if (!studyMaterial) {
      return res.status(404).json({
        success: false,
        message: 'Study material not found'
      });
    }

    // Check if faculty is the owner of the study material
    if (studyMaterial.faculty.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this study material'
      });
    }

    // Update fields
    const { title, description, subjectId, classId, materialType } = req.body;
    
    if (title) studyMaterial.title = title;
    if (description) studyMaterial.description = description;
    if (materialType) studyMaterial.materialType = materialType;
    
    if (subjectId) {
      // Check if subject exists
      const subject = await Subject.findById(subjectId);
      if (!subject) {
        return res.status(404).json({
          success: false,
          message: 'Subject not found'
        });
      }
      studyMaterial.subject = subjectId;
    }
    
    if (classId) {
      // Check if class exists
      const classObj = await Class.findById(classId);
      if (!classObj) {
        return res.status(404).json({
          success: false,
          message: 'Class not found'
        });
      }
      studyMaterial.class = classId;
    }

    // If new file is uploaded, update file info and delete old file
    if (req.file) {
      // Delete old file if exists
      if (studyMaterial.fileUrl) {
        const oldFilePath = path.join(__dirname, '..', 'public', studyMaterial.fileUrl);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }

      // Update with new file info
      studyMaterial.fileUrl = `/uploads/study-materials/${req.file.filename}`;
      studyMaterial.fileName = req.file.originalname;
      studyMaterial.fileType = req.file.mimetype;
      studyMaterial.fileSize = req.file.size;
    }

    await studyMaterial.save();

    res.status(200).json({
      success: true,
      data: studyMaterial
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update study material',
      error: error.message
    });
  }
};

// Delete a study material
const deleteStudyMaterial = async (req, res) => {
  try {
    const studyMaterial = await StudyMaterial.findById(req.params.id);
    
    if (!studyMaterial) {
      return res.status(404).json({
        success: false,
        message: 'Study material not found'
      });
    }

    // Check if faculty is the owner of the study material
    if (studyMaterial.faculty.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this study material'
      });
    }

    // Delete file if exists
    if (studyMaterial.fileUrl) {
      const filePath = path.join(__dirname, '..', 'public', studyMaterial.fileUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await StudyMaterial.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Study material deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete study material',
      error: error.message
    });
  }
};

// Get study materials by class
const getStudyMaterialsByClass = async (req, res) => {
  try {
    const studyMaterials = await StudyMaterial.find({ class: req.params.classId })
      .populate('subject', 'name code')
      .populate('class', 'classString')
      .populate('faculty', 'name email')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: studyMaterials.length,
      data: studyMaterials
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch study materials',
      error: error.message
    });
  }
};

// Get study materials by faculty
const getStudyMaterialsByFaculty = async (req, res) => {
  try {
    const studyMaterials = await StudyMaterial.find({ faculty: req.params.facultyId })
      .populate('subject', 'name code')
      .populate('class', 'classString')
      .populate('faculty', 'name email')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: studyMaterials.length,
      data: studyMaterials
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch study materials',
      error: error.message
    });
  }
};

// Get study materials by subject
const getStudyMaterialsBySubject = async (req, res) => {
  try {
    const studyMaterials = await StudyMaterial.find({ subject: req.params.subjectId })
      .populate('subject', 'name code')
      .populate('class', 'classString')
      .populate('faculty', 'name email')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: studyMaterials.length,
      data: studyMaterials
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch study materials',
      error: error.message
    });
  }
};

module.exports = {
  getAllStudyMaterials,
  getStudyMaterialById,
  createStudyMaterial,
  updateStudyMaterial,
  deleteStudyMaterial,
  getStudyMaterialsByClass,
  getStudyMaterialsByFaculty,
  getStudyMaterialsBySubject
};