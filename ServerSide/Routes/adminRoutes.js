const express = require('express');
const {getAllAdmins, getAdminById, createAdmin, updateAdmin, deleteAdmin} = require('../Controller/adminController')
const router = express.Router();

router.get('/', getAllAdmins)

router.get('/:id', getAdminById)

router.post('/', createAdmin)

router.put('/:id', updateAdmin)

router.delete('/:id', deleteAdmin)

module.exports = router;