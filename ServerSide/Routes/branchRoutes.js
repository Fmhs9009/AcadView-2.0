const express = require('express');
const {
  getAllBranches,
  getBranchById,
  createBranch,
  updateBranch,
  deleteBranch
} = require('../Controller/branchController');

const router = express.Router();

// Get all branches
router.get('/', getAllBranches);

// Get a specific branch by ID
router.get('/:id', getBranchById);

// Create a new branch
router.post('/', createBranch);

// Update a branch
router.put('/:id', updateBranch);

// Delete a branch
router.delete('/:id', deleteBranch);

module.exports = router;
