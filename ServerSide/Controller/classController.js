const Class = require('../Model/Class');
const Batch = require('../Model/Batch');
const Branch = require('../Model/Branch');

// Get all classes
const getAllClasses = async (req, res) => {
  try {
    const classes = await Class.find()
      .populate('batch')
      .populate('branch');
    
    res.status(200).json({
      success: true,
      count: classes.length,
      data: classes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch classes',
      error: error.message
    });
  }
};

// Get a single class by ID
const getClassById = async (req, res) => {
  try {
    const classObj = await Class.findById(req.params.id)
      .populate('batch')
      .populate('branch');
    
    if (!classObj) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }

    res.status(200).json({
      success: true,
      data: classObj
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch class',
      error: error.message
    });
  }
};

// Create a new class
const createClass = async (req, res) => {
  try {
    const { batchId, branchId, section } = req.body;

    // Fetch batch and branch to create class string
    const batch = await Batch.findById(batchId);
    const branch = await Branch.findById(branchId);

    if (!batch || !branch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid batch or branch ID'
      });
    }

    // Create class string (e.g., "CSE-2021-A")
    const classString = `${branch.name}-${batch.name}-${section}`;

    // Check if class already exists
    const existingClass = await Class.findOne({ classString });
    if (existingClass) {
      return res.status(400).json({
        success: false,
        message: 'Class already exists'
      });
    }

    const newClass = new Class({
      batch: batchId,
      branch: branchId,
      section,
      classString
    });

    await newClass.save();

    res.status(201).json({
      success: true,
      data: newClass
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create class',
      error: error.message
    });
  }
};

// Get or create a class
const getOrCreateClass = async (req, res) => {
  try {
    const { batchId, branchId, sectionId } = req.body;

    // Fetch batch and branch to create class string
    const batch = await Batch.findById(batchId);
    const branch = await Branch.findById(branchId);

    if (!batch || !branch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid batch or branch ID'
      });
    }

    // Create class string (e.g., "CSE-2021-A")
    const classString = `${branch.name}-${batch.name}-${sectionId}`;

    // Check if class already exists
    let classObj = await Class.findOne({ classString });
    
    // If not, create it
    if (!classObj) {
      classObj = new Class({
        batch: batchId,
        branch: branchId,
        section: sectionId,
        classString
      });

      await classObj.save();
    }

    res.status(200).json({
      success: true,
      data: classObj
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get or create class',
      error: error.message
    });
  }
};

// Generate class string
const generateClassString = async (req, res) => {
  try {
    const { batchId, branchId, sectionId } = req.query;

    // Fetch batch and branch to create class string
    const batch = await Batch.findById(batchId);
    const branch = await Branch.findById(branchId);

    if (!batch || !branch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid batch or branch ID'
      });
    }

    // Create class string (e.g., "CSE-2021-A")
    const classString = `${branch.name}-${batch.name}-${sectionId}`;

    res.status(200).json({
      success: true,
      classString
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to generate class string',
      error: error.message
    });
  }
};

// Update a class
const updateClass = async (req, res) => {
  try {
    const classObj = await Class.findById(req.params.id);
    
    if (!classObj) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }

    // If updating batch, branch, or section, regenerate class string
    if (req.body.batchId || req.body.branchId || req.body.section) {
      const batchId = req.body.batchId || classObj.batch;
      const branchId = req.body.branchId || classObj.branch;
      const section = req.body.section || classObj.section;

      // Fetch batch and branch to create class string
      const batch = await Batch.findById(batchId);
      const branch = await Branch.findById(branchId);

      if (!batch || !branch) {
        return res.status(400).json({
          success: false,
          message: 'Invalid batch or branch ID'
        });
      }

      // Create class string (e.g., "CSE-2021-A")
      req.body.classString = `${branch.name}-${batch.name}-${section}`;

      // Check if class string already exists for another class
      const existingClass = await Class.findOne({
        classString: req.body.classString,
        _id: { $ne: req.params.id }
      });

      if (existingClass) {
        return res.status(400).json({
          success: false,
          message: 'Class with this combination already exists'
        });
      }
    }

    // Update fields
    const updatedClass = await Class.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: updatedClass
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update class',
      error: error.message
    });
  }
};

// Delete a class
const deleteClass = async (req, res) => {
  try {
    const classObj = await Class.findById(req.params.id);
    
    if (!classObj) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }

    await Class.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Class deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete class',
      error: error.message
    });
  }
};

module.exports = {
  getAllClasses,
  getClassById,
  createClass,
  getOrCreateClass,
  generateClassString,
  updateClass,
  deleteClass
};