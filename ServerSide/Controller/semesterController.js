const Semester = require('../Model/Semester');

// Get all semesters
const getAllSemesters = async (req, res) => {
  try {
    const semesters = await Semester.find();
    
    res.status(200).json({
      success: true,
      count: semesters.length,
      data: semesters
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch semesters',
      error: error.message
    });
  }
};

// Get a single semester by ID
const getSemesterById = async (req, res) => {
  try {
    const semester = await Semester.findById(req.params.id);
    
    if (!semester) {
      return res.status(404).json({
        success: false,
        message: 'Semester not found'
      });
    }

    res.status(200).json({
      success: true,
      data: semester
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch semester',
      error: error.message
    });
  }
};

// Create a new semester
const createSemester = async (req, res) => {
  try {
    const { name } = req.body;

    // Check if semester with the same name already exists
    const existingSemester = await Semester.findOne({ name });

    if (existingSemester) {
      return res.status(400).json({
        success: false,
        message: 'Semester with this name already exists'
      });
    }

    const semester = await Semester.create({ name });

    res.status(201).json({
      success: true,
      message: 'Semester created successfully',
      data: semester
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create semester',
      error: error.message
    });
  }
};

// Update a semester
const updateSemester = async (req, res) => {
  try {
    const { name } = req.body;

    // Check if updating name, make sure it doesn't conflict with existing records
    if (name) {
      const existingSemester = await Semester.findOne({
        name,
        _id: { $ne: req.params.id }
      });

      if (existingSemester) {
        return res.status(400).json({
          success: false,
          message: 'Semester name already in use'
        });
      }
    }

    const updatedSemester = await Semester.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true, runValidators: true }
    );

    if (!updatedSemester) {
      return res.status(404).json({
        success: false,
        message: 'Semester not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Semester updated successfully',
      data: updatedSemester
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update semester',
      error: error.message
    });
  }
};

// Delete a semester
const deleteSemester = async (req, res) => {
  try {
    const semester = await Semester.findByIdAndDelete(req.params.id);

    if (!semester) {
      return res.status(404).json({
        success: false,
        message: 'Semester not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Semester deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete semester',
      error: error.message
    });
  }
};

module.exports = {
  getAllSemesters,
  getSemesterById,
  createSemester,
  updateSemester,
  deleteSemester
};
