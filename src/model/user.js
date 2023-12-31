const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    plant: {
        type: Array,
    },
    role:{
        type:String,
        default:'User'
    }
})

const UserModel = mongoose.model('user', userSchema);

module.exports = UserModel