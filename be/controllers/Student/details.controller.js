import studentDetails from '../../models/Students/details.model.js';

export const addDetails = async(req, res)=>{
    try{
        let student = await studentDetails.findOne({enrollmentNo:req.body.enrollmentNo})
        if(student){
            return res.status(400).json({message:"Student already exists"})
        }
        student = studentDetails.create(req.body)
        res.status(201).json({message: 'Student details added successfully', student})
    }
    catch(err){
        res.status(500).json({message: 'Error adding student details', error: err})
    }
}

export const updateDetails = async(req, res)=>{
    try{
        let student = await studentDetails.findOne({enrollmentNo:req.body.enrollmentNo})
        if(!student){
            return res.status(404).json({message:"Student not found"})
        }
        student = await studentDetails.updateOne({enrollmentNo:req.body.enrollmentNo}, req.body)
        res.status(200).json({message: 'Student details updated successfully', student})
    }
    catch(err){
        res.status(500).json({message: 'Error updating student details', error: err})
    }
}

// export default addDetails;