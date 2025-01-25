import adminDetails from '../../models/Admin/details.models.js'

const addDetails = async(req, res)=>{
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

export default addDetails;