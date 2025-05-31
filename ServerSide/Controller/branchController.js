const Branch = require('../Model/Branch');

// Get all branches
const getAllBranches = async (req, res) => {
  try {
    const branches = await Branch.find();
    
    res.status(200).json({
      success: true,
      count: branches.length,
      data: branches
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch branches',
      error: error.message
    });
  }
};

// Get a single branch by ID
const getBranchById = async (req, res) => {
  try {
    const branch = await Branch.findById(req.params.id);
    
    if (!branch) {
      return res.status(404).json({
        success: false,
        message: 'Branch not found'
      });
    }

    res.status(200).json({
      success: true,
      data: branch
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch branch',
      error: error.message
    });
  }
};

// Create a new branch
const createBranch = async (req, res) => {
  try {
    const { name } = req.body;

    // Check if branch with the same name already exists
    const existingBranch = await Branch.findOne({ name });

    if (existingBranch) {
      return res.status(400).json({
        success: false,
        message: 'Branch with this name already exists'
      });
    }

    const branch = await Branch.create({ name });

    res.status(201).json({
      success: true,
      message: 'Branch created successfully',
      data: branch
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create branch',
      error: error.message
    });
  }
};

// Update a branch
const updateBranch = async (req, res) => {
  try {
    const { name } = req.body;

    // Check if updating name, make sure it doesn't conflict with existing records
    if (name) {
      const existingBranch = await Branch.findOne({
        name,
        _id: { $ne: req.params.id }
      });

      if (existingBranch) {
        return res.status(400).json({
          success: false,
          message: 'Branch name already in use'
        });
      }
    }

    const updatedBranch = await Branch.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true, runValidators: true }
    );

    if (!updatedBranch) {
      return res.status(404).json({
        success: false,
        message: 'Branch not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Branch updated successfully',
      data: updatedBranch
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update branch',
      error: error.message
    });
  }
};

// Delete a branch
const deleteBranch = async (req, res) => {
  try {
    const branch = await Branch.findByIdAndDelete(req.params.id);

    if (!branch) {
      return res.status(404).json({
        success: false,
        message: 'Branch not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Branch deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete branch',
      error: error.message
    });
  }
};

module.exports = {
  getAllBranches,
  getBranchById,
  createBranch,
  updateBranch,
  deleteBranch
};
