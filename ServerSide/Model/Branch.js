const mongoose = require('mongoose');
 
const BranchSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
}, { timestamps: true })
 
const Branch = mongoose.model('Branch', BranchSchema);
module.exports = Branch;