import adminDetails from '../../models/Admin/details.models.js'

export const addDetails = async(req, res)=>{
    try{
        let admin = await adminDetails.findOne({employeeId:req.body.employeeId})
        if(admin){
            return res.status(400).json({message:"Employee ID already exists"})
        }
        admin = await adminDetails.create(req.body)
        res.status(201).json({message: 'Admin details added successfully', data: admin})
    }
    catch(err){
        res.status(500).json({message: 'Error adding admin details', data: err})
    }
}

export const updateDetails = async(req, res)=>{
    try{
        let admin = await adminDetails.findOne({employeeId:req.body.employeeId})
        if(!admin){
            return res.status(404).json({message:"Employee ID not found"})
        }
        admin = await adminDetails.updateOne({employeeId:req.body.employeeId}, req.body)
        res.status(200).json({message: 'Admin details updated successfully', data: admin})
    }
    catch(err){
        res.status(500).json({message: 'Internal Server Error', data: err})
    }
}

// export default addDetails;