import facultyDetails from '../../models/Faculty/details.model.js'

export const addDetails = async(req, res)=>{
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

export const updateDetails = async(req, res)=>{
    try{
        let faculty = await facultyDetails.findOne({employeeId: req.body.employeeId})
        if(!faculty){
            return res.status(404).json({message: "Faculty not found."})
        }
        faculty = await facultyDetails.updateOne({employeeId: req.body.employeeId}, req.body)
        res.status(200).json({message: 'Faculty details updated successfully', faculty})
    }
    catch(err){
        res.status(500).json({message: 'Internal Server Error', error: err.message})
    }
}

// export default {addDetails, updateDetails};
// export default addDetails;