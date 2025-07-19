const Student = require('../Model/Student');

// Get all students
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find()
      // .populate('semester')
      .populate('branch');
    
    res.status(200).json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch students',
      error: error.message
    });
  }
};

// Get a single student by ID
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      // .populate('semester')
      .populate('branch');
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch student',
      error: error.message
    });
  }
};

// Create a new student
const createStudent = async (req, res) => {
  try {
    const {
      name,
      email,
      phoneNo,
      gender,
      enrollmentNo,
      semester,
      branch,
      section,
      batch
    } = req.body;

    // Check if student with the same email or enrollment number already exists
    const existingStudent = await Student.findOne({
      $or: [{ email }, { enrollmentNo }]
    });

    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: 'Student with this email or enrollment number already exists'
      });
    }

    const student = await Student.create({
      name,
      email,
      phoneNo,
      gender,
      enrollmentNo,
      semester,
      branch,
      section,
      batch
    });

    res.status(201).json({
      success: true,
      message: 'Student created successfully',
      data: student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create student',
      error: error.message
    });
  }
};

// Update a student
const updateStudent = async (req, res) => {
  try {
    const {
      name,
      email,
      phoneNo,
      gender,
      enrollmentNo,
      semester,
      branch,
      section,
      batch
    } = req.body;

    // Check if updating email or enrollmentNo, make sure they don't conflict with existing records
    if (email || enrollmentNo) {
      const existingStudent = await Student.findOne({
        $or: [
          { email: email },
          { enrollmentNo: enrollmentNo }
        ],
        _id: { $ne: req.params.id }
      });

      if (existingStudent) {
        return res.status(400).json({
          success: false,
          message: 'Email or enrollment number already in use by another student'
        });
      }
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      {
        name,
        email,
        phoneNo,
        gender,
        enrollmentNo,
        semester,
        branch,
        section,
        batch
      },
      { new: true, runValidators: true }
    ).populate('branch');
    // .populate('semester');

    if (!updatedStudent) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Student updated successfully',
      data: updatedStudent
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update student',
      error: error.message
    });
  }
};

// Delete a student
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Student deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete student',
      error: error.message
    });
  }
};

// Get students by filter (semester, branch, section, batch)
const getStudentsByFilter = async (req, res) => {
  try {
    const { semester, branch, section, batch } = req.query;
    
    // Build filter object based on provided query parameters
    const filter = {};
    if (semester) filter.semester = semester;
    if (branch) filter.branch = branch;
    if (section) filter.section = section;
    if (batch) filter.batch = batch;
    
    const students = await Student.find(filter)
      // .populate('semester')
      .populate('branch');
    
    res.status(200).json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch students',
      error: error.message
    });
  }
};

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentsByFilter
};
