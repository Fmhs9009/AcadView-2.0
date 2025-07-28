const Assignment = require('../Model/Assignment');

// Get all assignments
const getAllAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find()
      .populate('subject')
      .populate('class')
      .populate('faculty', '-password');
    
    res.status(200).json({
      success: true,
      count: assignments.length,
      data: assignments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch assignments',
      error: error.message
    });
  }
};

// Get a single assignment by ID
const getAssignmentById = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id)
      .populate('subject')
      .populate('class')
      .populate('faculty', '-password');
    
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch assignment',
      error: error.message
    });
  }
};

// Create a new assignment
const createAssignment = async (req, res) => {
  try {
    const { 
      title, description, instructions, dueDate, maxMarks, 
      subjectId, classId, facultyId, allowLateSubmission, 
      latePenalty, submissionFormat 
    } = req.body;

    // Handle file upload if present
    let fileUrl = '';
    if (req.file) {
      // In a real implementation, you would upload the file to a storage service
      // and get back a URL to store in the database
      fileUrl = `/uploads/${req.file.filename}`;
    }

    const newAssignment = new Assignment({
      title,
      description,
      instructions,
      dueDate,
      maxMarks,
      subject: subjectId,
      class: classId,
      faculty: facultyId,
      fileUrl,
      allowLateSubmission: allowLateSubmission === 'true',
      latePenalty: latePenalty || 0,
      submissionFormat
    });

    await newAssignment.save();

    res.status(201).json({
      success: true,
      data: newAssignment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create assignment',
      error: error.message
    });
  }
};

// Update an assignment
const updateAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    // Update fields
    const updatedAssignment = await Assignment.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: updatedAssignment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update assignment',
      error: error.message
    });
  }
};

// Delete an assignment
const deleteAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    await Assignment.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Assignment deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete assignment',
      error: error.message
    });
  }
};

// Get assignments by class
const getAssignmentsByClass = async (req, res) => {
  try {
    const assignments = await Assignment.find({ class: req.params.classId })
      .populate('subject')
      .populate('faculty', '-password');
    
    res.status(200).json({
      success: true,
      count: assignments.length,
      data: assignments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch assignments',
      error: error.message
    });
  }
};

// Get assignments by faculty
const getAssignmentsByFaculty = async (req, res) => {
  try {
    const assignments = await Assignment.find({ faculty: req.params.facultyId })
      .populate('subject')
      .populate('class');
    
    res.status(200).json({
      success: true,
      count: assignments.length,
      data: assignments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch assignments',
      error: error.message
    });
  }
};

module.exports = {
  getAllAssignments,
  getAssignmentById,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  getAssignmentsByClass,
  getAssignmentsByFaculty
};