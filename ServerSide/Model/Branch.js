import mongoose from 'mongoose';
 
const BranchSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
}, { timestamps: true })
 
const Branch = mongoose.model('Branch', BranchSchema);
export default Branch;