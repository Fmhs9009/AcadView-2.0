// controllers/batchController.js
const Batch = require('../Model/Batch');

// Get all batches
const getAllBatches = async (req, res) => {
  try {
    const batches = await Batch.find().sort({ startYear: -1 });
    
    res.status(200).json({
      success: true,
      count: batches.length,
      data: batches
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch batches',
      error: error.message
    });
  }
};

// Get a single batch by ID
const getBatchById = async (req, res) => {
  try {
    const batch = await Batch.findById(req.params.id);
    
    if (!batch) {
      return res.status(404).json({
        success: false,
        message: 'Batch not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: batch
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch batch',
      error: error.message
    });
  }
};

// Create a new batch
const createBatch = async (req, res) => {
  try {
    const { name, startYear, endYear } = req.body;
    
    // Validate input
    if (!name || !startYear || !endYear) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, startYear, and endYear'
      });
    }
    
    // Check if batch with the same name already exists
    const existingBatch = await Batch.findOne({ name });
    
    if (existingBatch) {
      return res.status(400).json({
        success: false,
        message: 'Batch with this name already exists'
      });
    }
    
    // Validate years
    if (parseInt(startYear) >= parseInt(endYear)) {
      return res.status(400).json({
        success: false,
        message: 'End year must be greater than start year'
      });
    }
    
    const batch = await Batch.create({
      name,
      startYear: parseInt(startYear),
      endYear: parseInt(endYear)
    });
    
    res.status(201).json({
      success: true,
      message: 'Batch created successfully',
      data: batch
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create batch',
      error: error.message
    });
  }
};

// Update a batch
const updateBatch = async (req, res) => {
  try {
    const { name, startYear, endYear, isActive } = req.body;
    
    // Check if updating name, make sure it doesn't conflict with existing records
    if (name) {
      const existingBatch = await Batch.findOne({
        name,
        _id: { $ne: req.params.id }
      });
      
      if (existingBatch) {
        return res.status(400).json({
          success: false,
          message: 'Batch name already in use'
        });
      }
    }
    
    // Validate years if both are provided
    if (startYear && endYear && parseInt(startYear) >= parseInt(endYear)) {
      return res.status(400).json({
        success: false,
        message: 'End year must be greater than start year'
      });
    }
    
    const updatedBatch = await Batch.findByIdAndUpdate(
      req.params.id,
      {
        name,
        startYear: startYear ? parseInt(startYear) : undefined,
        endYear: endYear ? parseInt(endYear) : undefined,
        isActive
      },
      { new: true, runValidators: true }
    );
    
    if (!updatedBatch) {
      return res.status(404).json({
        success: false,
        message: 'Batch not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Batch updated successfully',
      data: updatedBatch
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update batch',
      error: error.message
    });
  }
};

// Delete a batch
const deleteBatch = async (req, res) => {
  try {
    const batch = await Batch.findById(req.params.id);
    
    if (!batch) {
      return res.status(404).json({
        success: false,
        message: 'Batch not found'
      });
    }
    
    // TODO: Check if batch is being used by any sections or classes before deleting
    
    await batch.remove();
    
    res.status(200).json({
      success: true,
      message: 'Batch deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete batch',
      error: error.message
    });
  }
};

// Get current semester for a batch
const getCurrentSemester = async (req, res) => {
  try {
    const batch = await Batch.findById(req.params.id);
    
    if (!batch) {
      return res.status(404).json({
        success: false,
        message: 'Batch not found'
      });
    }
    
    const currentSemester = batch.getCurrentSemester();
    
    res.status(200).json({
      success: true,
      data: {
        batchId: batch._id,
        batchName: batch.name,
        currentSemester
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get current semester',
      error: error.message
    });
  }
};

module.exports = {
  getAllBatches,
  getBatchById,
  createBatch,
  updateBatch,
  deleteBatch,
  getCurrentSemester
};