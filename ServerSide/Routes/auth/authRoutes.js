const express = require('express')
const login = require('../../Controller/auth/login')
const router = express.Router()


router.post('/login', login)

module.exports = router