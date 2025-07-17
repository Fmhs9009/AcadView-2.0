const express = require('express');
const router = express.Router();
const {
  upload,
  uploadStudyMaterial,
  getAllStudyMaterials,
  getStudyMaterialsByClass,
  getStudyMaterialsByFaculty,
  getStudyMaterialById,
  updateStudyMaterial,
  deleteStudyMaterial,
  downloadStudyMaterial
} = require('../Controller/studyMaterialController');

// Upload study material with file
router.post('/', upload.single('file'), uploadStudyMaterial);

// Get all study materials with filtering
router.get('/', getAllStudyMaterials);

// Get study materials by class
router.get('/class/:classId', getStudyMaterialsByClass);

// Get study materials by faculty
router.get('/faculty/:facultyId', getStudyMaterialsByFaculty);

// Get study material by ID
router.get('/:id', getStudyMaterialById);

// Update study material
router.put('/:id', updateStudyMaterial);

// Delete study material
router.delete('/:id', deleteStudyMaterial);

// Download study material file
router.get('/:id/download', downloadStudyMaterial);

module.exports = router;