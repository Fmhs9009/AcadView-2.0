const Faculty = require('../Model/Faculty')

// Get all Faculty
const getAllFaculties = async (req, res) => {
    try{
        const faculties = await Faculty.find().populate('assignedClasses.subject')

        res.status(200).json({
            success: true,
            count: faculties.length,
            data: faculties
        });
    } 
    catch(err){
        res.status(500).json({
            success: false,
            message: 'Failed to fetch faculties',
            error: err.message
        });
    }
};

const getFacultyById = async (req, res) => {
    try{
        const facultyId = req.params.id;
        const faculty = await Faculty.findById(facultyId).populate('assignedClasses.subject')
        if(!faculty){
            return res.status(404).json({
                success: false,
                message: 'Faculty not found',
            });
        }
        res.status(200).json({
            success: true,
            data: faculty
        });
    }
    catch(err){
        res.status(500).json({
            success: false,
            message: 'Failed to fetch faculty',
            error: err.message
        });
    }
}

const createFaculty = async (req, res) =>{
    try{
        const {email,empId} = req.body;
        const existingFaculty = await Faculty.findOne({ 
                $or: [{ email }, { empId }] 
        });
        if(existingFaculty){
            return res.status(400).json({
                success: false,
                message: 'Faculty already exists',
            });
        }
        
        const faculty = await Faculty.create(req.body)
        res.status(201).json({
            success: true,
            data: faculty
        })
    }
    catch(err){
        res.status(500).json({
            success: false,
            message: 'Failed to create faculty',
            error: err.message
        })
    };
}

const updateFaculty = async (req, res) =>{
    try{
        const facultyId = req.params.id;
        const {
            name,
            email,
            phoneNo,
            gender,
            empId,
            department,
            designation,
        } = req.body;
        
        if(email || empId){
            const existingFaculty = await Faculty.findOne({
                $or: [{ email }, { empId }], _id : { $ne: facultyId }
            });
            if(existingFaculty){
                return res.status(400).json({
                    success: false,
                    message: 'Email or employee id already in use by another faculty',
                });
            }
        }

        const updatedFaculty = await Faculty.findByIdAndUpdate(facultyId, req.body, { new: true, runValidators: true });
        if (!updatedFaculty){
            return res.status(404).json({
                success: false,
                message: 'Faculty not found',
            });
        }
        res.status(200).json({
            success: true,
            data: updatedFaculty
        });
    }
    catch(err){
        res.status(500).json({
            success: false,
            message: 'Failed to update faculty',
            error: err.message
        });
    }
}

const deleteFaculty = async (req, res) =>{
    try{
        const facultyId = req.params.id;
        const faculty = await Faculty.findByIdAndDelete(facultyId);
        if (!faculty){
            return res.status(404).json({
                success: false,
                message: 'Faculty not found',
            });
        }
        res.status(200).json({
            success: true,
            data: faculty
        });
    }
    catch(err){
        res.status(500).json({
            success: false,
            message: 'Failed to delete faculty',
            error: err.message
        })
    }
}

module.exports = {
    getAllFaculties,
    getFacultyById,
    createFaculty,
    updateFaculty,
    deleteFaculty,
}