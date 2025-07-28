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
    const { startYear, endYear } = req.body;
    
    // Validate years
    if (endYear <= startYear) {
      return res.status(400).json({
        success: false,
        message: 'End year must be greater than start year'
      });
    }

    // Create batch name (e.g., "2021-2025")
    const name = `${startYear}-${endYear}`;

    // Check if batch already exists
    const existingBatch = await Batch.findOne({ name });
    if (existingBatch) {
      return res.status(400).json({
        success: false,
        message: 'Batch already exists'
      });
    }

    const newBatch = new Batch({
      name,
      startYear,
      endYear
    });

    await newBatch.save();

    res.status(201).json({
      success: true,
      data: newBatch
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
    const batch = await Batch.findById(req.params.id);
    
    if (!batch) {
      return res.status(404).json({
        success: false,
        message: 'Batch not found'
      });
    }

    // If updating years, regenerate name
    if (req.body.startYear || req.body.endYear) {
      const startYear = req.body.startYear || batch.startYear;
      const endYear = req.body.endYear || batch.endYear;
      
      // Validate years
      if (endYear <= startYear) {
        return res.status(400).json({
          success: false,
          message: 'End year must be greater than start year'
        });
      }

      // Create batch name
      req.body.name = `${startYear}-${endYear}`;

      // Check if batch name already exists for another batch
      const existingBatch = await Batch.findOne({
        name: req.body.name,
        _id: { $ne: req.params.id }
      });

      if (existingBatch) {
        return res.status(400).json({
          success: false,
          message: 'Batch with this name already exists'
        });
      }
    }

    // Update fields
    const updatedBatch = await Batch.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
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

    // Check if batch is being used by any classes
    const Class = require('../Model/Class');
    const classesUsingBatch = await Class.countDocuments({ batch: req.params.id });
    
    if (classesUsingBatch > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete batch as it is being used by ${classesUsingBatch} classes`
      });
    }

    await Batch.findByIdAndDelete(req.params.id);

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

// Get active batches
const getActiveBatches = async (req, res) => {
  try {
    const batches = await Batch.find({ isActive: true }).sort({ startYear: -1 });
    
    res.status(200).json({
      success: true,
      count: batches.length,
      data: batches
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch active batches',
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
  getActiveBatches
};