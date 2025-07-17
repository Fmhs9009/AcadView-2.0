const Class = require('../Model/Class');
const Batch = require('../Model/Batch');
const Branch = require('../Model/Branch');
const Section = require('../Model/Section');
const Student = require('../Model/Student');

// Get class string for a given batch, branch, and section
const getClassString = async (req, res) => {
  try {
    const { batchId, branchId, sectionId } = req.query;

    if (!batchId || !branchId || !sectionId) {
      return res.status(400).json({
        success: false,
        message: 'Batch ID, Branch ID, and Section ID are required'
      });
    }

    // Fetch the batch to calculate current semester
    const batch = await Batch.findById(batchId);
    if (!batch) {
      return res.status(404).json({
        success: false,
        message: 'Batch not found'
      });
    }

    // Fetch branch and section for names
    const [branch, section] = await Promise.all([
      Branch.findById(branchId),
      Section.findById(sectionId)
    ]);

    if (!branch || !section) {
      return res.status(404).json({
        success: false,
        message: 'Branch or Section not found'
      });
    }

    // Calculate current semester
    const currentSemester = batch.getCurrentSemester();
    
    // Generate class string
    const classString = `${currentSemester}${currentSemester === 1 ? 'st' : currentSemester === 2 ? 'nd' : currentSemester === 3 ? 'rd' : 'th'} Sem ${branch.name} ${section.name}`;

    res.status(200).json({
      success: true,
      data: {
        classString,
        semester: currentSemester,
        batch: batch.name,
        branch: branch.name,
        section: section.name
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to generate class string',
      error: err.message
    });
  }
};

// Get or create a class for given parameters
const getOrCreateClass = async (req, res) => {
  try {
    const { batchId, branchId, sectionId } = req.body;

    if (!batchId || !branchId || !sectionId) {
      return res.status(400).json({
        success: false,
        message: 'Batch ID, Branch ID, and Section ID are required'
      });
    }

    // Calculate current semester
    const batch = await Batch.findById(batchId);
    if (!batch) {
      return res.status(404).json({
        success: false,
        message: 'Batch not found'
      });
    }

    const currentSemester = batch.getCurrentSemester();

    // Check if class already exists
    let existingClass = await Class.findOne({
      batch: batchId,
      branch: branchId,
      section: sectionId,
      semester: currentSemester
    }).populate('batch branch section');

    if (existingClass) {
      return res.status(200).json({
        success: true,
        data: existingClass
      });
    }

    // Create new class
    const newClass = new Class({
      batch: batchId,
      branch: branchId,
      section: sectionId,
      semester: currentSemester
    });

    await newClass.save();
    await newClass.populate('batch branch section');

    res.status(201).json({
      success: true,
      data: newClass
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to get or create class',
      error: err.message
    });
  }
};

// Get all classes
const getAllClasses = async (req, res) => {
  try {
    const classes = await Class.find()
      .populate('batch branch section')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: classes.length,
      data: classes
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch classes',
      error: err.message
    });
  }
};

// Get classes by faculty (based on assigned subjects)
const getClassesByFaculty = async (req, res) => {
  try {
    const { facultyId } = req.params;
    
    // This would require Faculty model to have assigned classes
    // For now, return all classes
    const classes = await Class.find()
      .populate('batch branch section')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: classes.length,
      data: classes
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch faculty classes',
      error: err.message
    });
  }
};

// Get students in a specific class
const getStudentsInClass = async (req, res) => {
  try {
    const { classId } = req.params;
    
    const classData = await Class.findById(classId)
      .populate('batch branch section students');
    
    if (!classData) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        class: classData,
        students: classData.students
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch students in class',
      error: err.message
    });
  }
};

module.exports = {
  getClassString,
  getOrCreateClass,
  getAllClasses,
  getClassesByFaculty,
  getStudentsInClass
};