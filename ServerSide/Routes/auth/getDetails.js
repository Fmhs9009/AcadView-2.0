const Admin = require('../../Model/Admin')
const Faculty = require('../../Model/Faculty')
const Student = require('../../Model/Student')
const Hod = require('../../Model/HOD')

const express = require('express')
const router = express.Router()
require('dotenv').config()
const jwt = require('jsonwebtoken');
router.get('/', async (req, res) => {
    console.log(req.cookies.auth_token)
    var decoded = jwt.verify(req.cookies.auth_token, process.env.JWT_SECRET_KEY);
    if (!decoded){
        return res.status(401).json({ message: "Unauthorized" });
    }
    if (decoded.role == 'faculty'){
        const faculty = await Faculty.findOne({_id: decoded.id})
        if (!faculty){
            return res.status(404).json({message: 'Faculty not found'})
        }
        return res.status(200).json({data: faculty, role: decoded.role})
    }
    if(decoded.role == 'student'){
        const student = await Student.findOne({_id: decoded.id})
        if (!student){
            return res.status(404).json({message: 'Student not found'})
        }
        return res.status(200).json({data: student, role: decoded.role})
    }
    if (decoded.role == 'hod'){
        const hod = await Hod.findOne({_id: decoded.id})
        if (!hod){
            return res.status(404).json({message: 'HOD not found'})
        }
        return res.status(200).json({data: hod, role: decoded.role})
    }
    if (decoded.role == 'admin'){
        const admin = await Admin.findOne({_id: decoded.id})
        if (!admin){
            return res.status(404).json({message: 'Admin not found'})
        }
        return res.status(200).json({data: admin, role: decoded.role})
    }
})

module.exports = router