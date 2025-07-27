const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Set up multer storage for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/study-materials');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    // Accept all file types for study materials
    cb(null, true);
  }
});

// Import controllers
const {
  getAllStudyMaterials,
  getStudyMaterialById,
  createStudyMaterial,
  updateStudyMaterial,
  deleteStudyMaterial,
  getStudyMaterialsByClass,
  getStudyMaterialsByFaculty,
  getStudyMaterialsBySubject
} = require('../Controller/studyMaterialController');

// Define routes
router.get('/', getAllStudyMaterials);
router.get('/:id', getStudyMaterialById);
router.post('/', upload.single('file'), createStudyMaterial);
router.put('/:id', upload.single('file'), updateStudyMaterial);
router.delete('/:id', deleteStudyMaterial);

// Additional routes
router.get('/class/:classId', getStudyMaterialsByClass);
router.get('/faculty/:facultyId', getStudyMaterialsByFaculty);
router.get('/subject/:subjectId', getStudyMaterialsBySubject);

module.exports = router;