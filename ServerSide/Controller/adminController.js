const Admin = require('../Model/Admin')

const getAllAdmins = async (req, res) => {
    try {
        const admins = await Admin.find()
        res.status(200).json({
            success: true,
            count: admins.length,
            data: admins
        })
    } 
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to get all admins',
            error: error.message
        })
    }
};

const getAdminById = async (req, res) => {
    try {
        const id = req.params.id
        const admin = await Admin.findById(id)
        if (!admin) {
            res.status(404).json({
                success: false,
                message: 'Admin not found'
            })
        } 
        res.status(200).json({
            success: true,
            data: admin
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to get admin by id',
            error: error.message
        })
    }
};

const createAdmin = async (req, res) => {
    try {
        const admin = await Admin.create(req.body)
        res.status(201).json({
            success: true,
            data: admin
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to create admin',
            error: error.message
        })
    }
};

const updateAdmin = async (req, res) => {
    try {
        const id = req.params.id
        const updatedAdmin = await Admin.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
        if (!updatedAdmin) {
            res.status(404).json({
                success: false,
                message: 'Admin not found'
            })
        }
        res.status(200).json({
            success: true,
            data: updatedAdmin
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update admin',
            error: error.message
        })
    }
};

const deleteAdmin = async (req, res) => {
    try {
        const id = req.params.id
        const deletedAdmin = await Admin.findByIdAndDelete(id)
        if (!deletedAdmin) {
            res.status(404).json({
                success: false,
                message: 'Admin not found'
            })
        }
        res.status(200).json({
            success: true,
            message: 'Admin deleted successfully'
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete admin',
            error: error.message
        })
    }
};


module.exports = {getAllAdmins, getAdminById, createAdmin, updateAdmin, deleteAdmin};