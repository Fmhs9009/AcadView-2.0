import studentDetails from '../../models/Students/details.model.js';

const addDetails = async(req, res)=>{
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

export default addDetails;