const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        default: 'admin'
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String
    },
    zone: {
        type: String,
    }
})

const AdminModel = mongoose.model('admin', adminSchema);

module.exports = AdminModel