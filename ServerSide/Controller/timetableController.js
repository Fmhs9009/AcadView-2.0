const Timetable = require('../Model/Timetable');

// Get all timetable entries
const getAllTimetableEntries = async (req, res) => {
  try {
    const timetable = await Timetable.find()
      .populate('subject')
      .populate('class')
      .populate('faculty', '-password');
    
    res.status(200).json({
      success: true,
      count: timetable.length,
      data: timetable
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch timetable entries',
      error: error.message
    });
  }
};

// Get timetable entries by class
const getTimetableByClass = async (req, res) => {
  try {
    const timetable = await Timetable.find({ class: req.params.classId })
      .populate('subject')
      .populate('faculty', '-password')
      .sort({ day: 1, startTime: 1 });
    
    res.status(200).json({
      success: true,
      count: timetable.length,
      data: timetable
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch timetable for class',
      error: error.message
    });
  }
};

// Get timetable entries by faculty
const getTimetableByFaculty = async (req, res) => {
  try {
    const timetable = await Timetable.find({ faculty: req.params.facultyId })
      .populate('subject')
      .populate('class')
      .sort({ day: 1, startTime: 1 });
    
    res.status(200).json({
      success: true,
      count: timetable.length,
      data: timetable
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch timetable for faculty',
      error: error.message
    });
  }
};

// Create a new timetable entry
const createTimetableEntry = async (req, res) => {
  try {
    const { day, startTime, endTime, room, subjectId, classId, facultyId } = req.body;

    // Check for time conflicts
    const conflictingEntry = await Timetable.findOne({
      day,
      class: classId,
      $or: [
        // New entry starts during an existing entry
        { startTime: { $lte: startTime }, endTime: { $gt: startTime } },
        // New entry ends during an existing entry
        { startTime: { $lt: endTime }, endTime: { $gte: endTime } },
        // New entry completely contains an existing entry
        { startTime: { $gte: startTime }, endTime: { $lte: endTime } }
      ]
    });

    if (conflictingEntry) {
      return res.status(400).json({
        success: false,
        message: 'Time conflict with existing timetable entry'
      });
    }

    const newTimetableEntry = new Timetable({
      day,
      startTime,
      endTime,
      room,
      subject: subjectId,
      class: classId,
      faculty: facultyId
    });

    await newTimetableEntry.save();

    res.status(201).json({
      success: true,
      data: newTimetableEntry
    });
  } catch (error) {
    // Check for duplicate key error (unique constraint violation)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A timetable entry already exists for this day, time, and class'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create timetable entry',
      error: error.message
    });
  }
};

// Update a timetable entry
const updateTimetableEntry = async (req, res) => {
  try {
    const timetableEntry = await Timetable.findById(req.params.id);
    
    if (!timetableEntry) {
      return res.status(404).json({
        success: false,
        message: 'Timetable entry not found'
      });
    }

    // Check for time conflicts if day, time, or class is being updated
    if (req.body.day || req.body.startTime || req.body.endTime || req.body.classId) {
      const day = req.body.day || timetableEntry.day;
      const startTime = req.body.startTime || timetableEntry.startTime;
      const endTime = req.body.endTime || timetableEntry.endTime;
      const classId = req.body.classId || timetableEntry.class;

      const conflictingEntry = await Timetable.findOne({
        _id: { $ne: req.params.id }, // Exclude the current entry
        day,
        class: classId,
        $or: [
          { startTime: { $lte: startTime }, endTime: { $gt: startTime } },
          { startTime: { $lt: endTime }, endTime: { $gte: endTime } },
          { startTime: { $gte: startTime }, endTime: { $lte: endTime } }
        ]
      });

      if (conflictingEntry) {
        return res.status(400).json({
          success: false,
          message: 'Time conflict with existing timetable entry'
        });
      }
    }

    // Update fields
    const updatedTimetableEntry = await Timetable.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: updatedTimetableEntry
    });
  } catch (error) {
    // Check for duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A timetable entry already exists for this day, time, and class'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update timetable entry',
      error: error.message
    });
  }
};

// Delete a timetable entry
const deleteTimetableEntry = async (req, res) => {
  try {
    const timetableEntry = await Timetable.findById(req.params.id);
    
    if (!timetableEntry) {
      return res.status(404).json({
        success: false,
        message: 'Timetable entry not found'
      });
    }

    await Timetable.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Timetable entry deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete timetable entry',
      error: error.message
    });
  }
};

module.exports = {
  getAllTimetableEntries,
  getTimetableByClass,
  getTimetableByFaculty,
  createTimetableEntry,
  updateTimetableEntry,
  deleteTimetableEntry
};