const Admin = require('../../Model/Admin')
const Faculty = require('../../Model/Faculty')
const Student = require('../../Model/Student')
const Hod = require('../../Model/HOD')

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const login = async (req, res) => {
    try {
        const { email, password, role } = req.body
        if (!email || !password || !role) {
            return res.status(400).json({ message: "Please fill all fields" })
        }
        if (role.toLowerCase() === 'admin') {
            const admin = await Admin.findOne({ email })
            if (!admin) {
                return res.status(404).json({ message: "Admin not found" })
            }
            const isMatch = await bcrypt.compare(password, admin.password)
            if (!isMatch) {
                return res.status(400).json({ message: "Invalid password" })
            }
            const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' })
            // Setting the token in the cookie
            res.cookie('auth_token', token, {
                // httpOnly: true,
                maxAge: 3600000 // 1 hour
            })
            res.status(200).json({
                success: true,
                message: "logged in successfully",
                // token: token
            })
        } 
        else if (role.toLowerCase() === 'faculty') {
            const faculty = await Faculty.findOne({ email })
            if (!faculty) {
                return res.status(404).json({ message: "Faculty not found" })
            }
            const isMatch = await bcrypt.compare(password, faculty.password)
            if (!isMatch) {
                return res.status(400).json({ message: "Invalid password" })
            }
            const token = jwt.sign({ id: faculty._id, role: 'faculty' }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' })
            // Setting the token in the cookie
            res.cookie('auth_token', token, {
                // httpOnly: true,
                maxAge: 3600000 // 1 hour
            })
            res.status(200).json({
                success: true,
                message: "logged in successfully",
                token: token
            })
        }
        else if (role.toLowerCase() === 'student') {
            const student = await Student.findOne({ email })
            if (!student) {
                return res.status(404).json({ message: "Student not found" })
            }
            const isMatch = await bcrypt.compare(password, student.password)
            if (!isMatch) {
                return res.status(400).json({ message: "Invalid password" })
            }
            const token = jwt.sign({ id: student._id, role: 'student' }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' })
            // Setting the token in the cookie
            res.cookie('auth_token', token, {
                // httpOnly: true,
                maxAge: 3600000, // 1 hour
                secure: true,
                sameSite: 'lax',
            })
            res.status(200).json({
                success: true,
                message: "logged in successfully",
                token: token
            })
        }
        else if (role.toLowerCase() === 'hod') {
            const hod = await Hod.findOne({ email })
            if (!hod) {
                return res.status(404).json({ message: "HOD not found" })
            }
            const isMatch = await bcrypt.compare(password, hod.password)
            if (!isMatch) {
                return res.status(400).json({ message: "Invalid password" })
            }
            const token = jwt.sign({ id: hod._id, role: 'hod' }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' })
            // Setting the token in the cookie
            res.cookie('auth_token', token, {
                // httpOnly: true,
                maxAge: 3600000 // 1 hour
            })
            res.status(200).json({
                success: true,
                message: "logged in successfully",
                token: token
            })
        }
        else {
            return res.status(400).json({ message: "Invalid role" })
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

module.exports = login;