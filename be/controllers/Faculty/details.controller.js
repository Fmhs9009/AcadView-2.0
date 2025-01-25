import facultyDetails from '../../models/Faculty/details.model.js'

const addDetails = async(req, res)=>{
    try{
        let faculty = await facultyDetails.findOne({employeeId: req.body.employeeId})
        if(faculty){
            return res.status(400).json({message: "Faculty already exist."})
        }
        faculty = await facultyDetails.create(req.body)
        res.status(201).json({message: 'Faculty details added successfully', faculty})
    }
    catch(err){
        res.status(500).json({message: 'Error adding faculty details', error: err.message
    })}
}

export default addDetails;