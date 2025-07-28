const express = require('express')
const router = express.Router()
const  {createBatch, deleteBatch, getAllBatches, getBatchById, updateBatch} = require('../Controller/batchController')

router.get('/', getAllBatches);

router.get('/:id', getBatchById);

router.post('/', createBatch);

router.put('/:id', updateBatch);

router.delete('/:id', deleteBatch);



module.exports = router;  //export the router to use in other files