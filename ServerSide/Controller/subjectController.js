const Subject = require('../Model/Subject')

// Get all subject
const getAllSubject = async (req, res) =>{
    try {
        const subject = await Subject.find().populate('semester')
        res.status(200).json({
            success: true,
            count: subject.length,
            data: subject
        })
    }
    catch(err){
        res.status(500).json({
            success: false,
            message: 'Failed to fetch subject',
            error: err.message
        });
    }
};

const getSubjectById = async (req, res) =>{
    try {
        const id = req.params.id;
        const subject = await Subject.findById(id).populate('semester')
        if(!subject){
            res.status(404).json({
                success: false,
                message: 'Subject not found',
            });
        }
        res.status(200).json({
            success: true,
            data: subject
        })
    }
    catch(err){
        res.status(500).json({
            success: false,
            message: 'Failed to fetch subject',
            error: err.message
        });
    }
}


const createSubject = async (req, res) =>{
    try {
        const {subject_id} = req.body;
        existingSubject = await Subject.findOne({subject_id})
        if(existingSubject){
            return res.status(400).json({
                success: false,
                message: 'Subject already exists',
            });
        }
        const subject = await Subject.create(req.body)
        res.status(201).json({
            success: true,
            message: 'Subject created successfully',
            data: subject
        })
    }
    catch(err){
        res.status(500).json({
            success: false,
            message: 'Failed to create subject',
            error: err.message
        });
    }
}

const updateSubject = async (req, res) =>{
    try {
        const id = req.params.id;
        const {subject_id} = req.body;
        const existingSubject = await Subject.findOne({
            subject_id,
            _id: {
                $ne: id
            }
        })
        if(existingSubject){
            return res.status(400).json({
                success: false,
                message: 'Subject_id already in use',
            });
        }
        const updatedSubject = await Subject.findByIdAndUpdate(id, req.body, {new: true, runValidators: true})
        if (!updatedSubject){
            return res.status(404).json({
                success: false,
                message: 'Subject not found',
            });
        }
        res.status(200).json({
            success: true,
            message: 'Subject updated successfully',
            data: updatedSubject
        })
    }
    catch(err){
        res.status(500).json({
            success: false,
            message: 'Failed to update subject',
            error: err.message
        })
    }
}


const deleteSubject = async (req, res) =>{
    try {
        const id = req.params.id;
        const subject = await Subject.findByIdAndDelete(id)
        if (!subject){
            return res.status(404).json({
                success: false,
                message: 'Subject not found',
            });
        }
        res.status(200).json({
            success: true,
            message: 'Subject deleted successfully',
        })
    }
    catch(err){
        res.status(500).json({
            success: false,
            message: 'Failed to delete subject',
            error: err.message
        })
    }
}

module.exports = {
    getAllSubject,
    getSubjectById,
    createSubject,
    updateSubject,
    deleteSubject
}
