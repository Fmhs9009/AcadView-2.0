const express = require('express')
const router = express.Router()
const  {createBatch, deleteBatch, getAllBatches, getBatchById, updateBatch, getCurrentSemester} = require('../Controller/batchController')

router.get('/', getAllBatches);

router.get('/:id', getBatchById);

router.post('/', createBatch);

router.put('/:id', updateBatch);

router.delete('/:id', deleteBatch);

router.get('/currentSemester', getCurrentSemester);

module.exports = router;  //export the router to use in other files