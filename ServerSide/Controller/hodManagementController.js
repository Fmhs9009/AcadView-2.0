const Faculty = require('../Model/Faculty');
const Student = require('../Model/Student');
const HOD = require('../Model/HOD');
const Branch = require('../Model/Branch');

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
      department, branch, fatherName, motherName, dob, address 
    } = req.body;

    // Find the branch document by name
    const branchDoc = await Branch.findOne({ name: branch });
    if (!branchDoc) {
      return res.status(400).json({ message: 'Invalid branch specified' });
    }

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
      address
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

module.exports = {
  checkDepartmentAccess,
  getDepartmentFaculty,
  getDepartmentStudents,
  addFaculty,
  addStudent,
  removeFaculty,
  removeStudent,
  getDepartmentStats
};