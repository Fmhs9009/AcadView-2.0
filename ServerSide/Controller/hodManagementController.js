const Faculty = require('../Model/Faculty');
const Student = require('../Model/Student');
const HOD = require('../Model/HOD');
const Branch = require('../Model/Branch');
const bcrypt = require('bcryptjs');

// Middleware to check if HOD has access to the department
const checkDepartmentAccess = async (req, res, next) => {
  try {
    const hod = await HOD.findById(req.user._id).populate('department');
    if (!hod) {
      return res.status(403).json({ message: 'Access denied. Not authorized as HOD.' });
    }
    req.hodDepartment = hod.department;
    next();
  } catch (error) {
    res.status(500).json({ message: 'Error checking department access', error: error.message });
  }
};

// Get all faculty in HOD's department
const getDepartmentFaculty = async (req, res) => {
  try {
    // Temporary: Using a default department since auth is disabled
    const faculty = await Faculty.find()
      .select('-password')
      .sort({ name: 1 });
    res.json(faculty);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching faculty', error: error.message });
  }
};

// Get all students in HOD's department
const getDepartmentStudents = async (req, res) => {
  try {
    const { batch, section } = req.query;
    const query = {};

    if (batch) query.batch = batch;
    if (section) query.section = section;

    const students = await Student.find(query)
      .populate('branch')
      .sort({ name: 1 });

    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching students', error: error.message });
  }
};

// Add new faculty to department
const addFaculty = async (req, res) => {
  try {
    const { name, email, phoneNo, gender, empId, designation, department } = req.body;

    const newFaculty = new Faculty({
      name,
      email,
      phoneNo,
      gender,
      empId,
      department,
      designation
    });

    await newFaculty.save();
    res.status(201).json(newFaculty);
  } catch (error) {
    res.status(500).json({ message: 'Error adding faculty', error: error.message });
  }
};

// Add new student to department
const addStudent = async (req, res) => {
  try {
    const { 
      name, email, phoneNo, gender, enrollmentNo, section, batch, 
      department, branch, fatherName, motherName, dob, address, password 
    } = req.body;

    // Find the branch document by name
    const branchDoc = await Branch.findOne({ name: branch });
    if (!branchDoc) {
      return res.status(400).json({ message: 'Invalid branch specified' });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const newStudent = new Student({
      name,
      email,
      phoneNo,
      gender,
      enrollmentNo,
      section,
      batch,
      branch: branchDoc._id,  // Use the branch document's ID
      // Additional fields stored in the database but not in schema
      fatherName,
      motherName,
      dob,
      address,
      password: hashPassword
    });

    await newStudent.save();
    res.status(201).json(newStudent);
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error
      const field = Object.keys(error.keyPattern)[0];
      res.status(400).json({ 
        message: `A student with this ${field} already exists`,
        error: error.message 
      });
    } else {
      res.status(500).json({ 
        message: 'Error adding student', 
        error: error.message 
      });
    }
  }
};

// Remove faculty from department
const removeFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.id);

    if (!faculty) {
      return res.status(404).json({ message: 'Faculty not found' });
    }

    await Faculty.deleteOne({ _id: req.params.id });
    res.json({ message: 'Faculty removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing faculty', error: error.message });
  }
};

// Remove student from department
const removeStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    await Student.deleteOne({ _id: req.params.id });
    res.json({ message: 'Student removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing student', error: error.message });
  }
};

// Get department statistics
const getDepartmentStats = async (req, res) => {
  try {
    const facultyCount = await Faculty.countDocuments();
    const studentCount = await Student.countDocuments();
    
    const batchWiseCount = await Student.aggregate([
      { $group: { _id: '$batch', count: { $sum: 1 } } },
      { $sort: { _id: -1 } }
    ]);

    const sectionWiseCount = await Student.aggregate([
      { $group: { _id: { batch: '$batch', section: '$section' }, count: { $sum: 1 } } },
      { $sort: { '_id.batch': -1, '_id.section': 1 } }
    ]);

    res.json({
      facultyCount,
      studentCount,
      batchWiseCount,
      sectionWiseCount
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching department statistics', error: error.message });
  }
};

// Update faculty details
const updateFaculty = async (req, res) => {
  try {
    const { id } = req.params;
    const facultyData = req.body;
    
    // Validate faculty exists
    const existingFaculty = await Faculty.findById(id);
    if (!existingFaculty) {
      return res.status(404).json({ message: 'Faculty not found' });
    }

    // Update faculty
    const updatedFaculty = await Faculty.findByIdAndUpdate(
      id,
      facultyData,
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedFaculty);
  } catch (error) {
    console.error('Error updating faculty:', error);
    if (error.code === 11000) {
      // Duplicate key error
      return res.status(400).json({ message: 'Email or Employee ID already exists' });
    }
    res.status(500).json({ message: 'Error updating faculty', error: error.message });
  }
};

// Update student details
const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const studentData = req.body;
    
    // Validate student exists
    const existingStudent = await Student.findById(id);
    if (!existingStudent) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // If branch is a string, find the branch by name
    if (typeof studentData.branch === 'string') {
      const branch = await Branch.findOne({ name: studentData.branch });
      if (branch) {
        studentData.branch = branch._id;
      } else {
        // Create new branch if it doesn't exist
        const newBranch = await Branch.create({ name: studentData.branch });
        studentData.branch = newBranch._id;
      }
    }

    // Update student
    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      studentData,
      { new: true, runValidators: true }
    ).populate('branch');

    res.status(200).json(updatedStudent);
  } catch (error) {
    console.error('Error updating student:', error);
    if (error.code === 11000) {
      // Duplicate key error
      return res.status(400).json({ message: 'Email or Enrollment Number already exists' });
    }
    res.status(500).json({ message: 'Error updating student', error: error.message });
  }
};

module.exports = {
  checkDepartmentAccess,
  getDepartmentFaculty,
  getDepartmentStudents,
  addFaculty,
  addStudent,
  updateFaculty,
  updateStudent,
  removeFaculty,
  removeStudent,
  getDepartmentStats
};