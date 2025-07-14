const HOD = require('../Model/HOD');

// Create HOD
const createHOD = async (req, res) => {
  try {
    const hod = new HOD(req.body);
    await hod.save();
    res.status(201).json(hod);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all HODs
const getAllHODs = async (req, res) => {
  try {
    const hods = await HOD.find().populate('departmentFaculty');
    res.json(hods);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get HOD by ID
const getHODById = async (req, res) => {
  try {
    const hod = await HOD.findById(req.params.id).populate('departmentFaculty');
    if (!hod) return res.status(404).json({ error: 'HOD not found' });
    res.json(hod);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update HOD
const updateHOD = async (req, res) => {
  try {
    const hod = await HOD.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!hod) return res.status(404).json({ error: 'HOD not found' });
    res.json(hod);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete HOD
const deleteHOD = async (req, res) => {
  try {
    const hod = await HOD.findByIdAndDelete(req.params.id);
    if (!hod) return res.status(404).json({ error: 'HOD not found' });
    res.json({ message: 'HOD deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createHOD,
  getAllHODs,
  getHODById,
  updateHOD,
  deleteHOD
}; 