const mongoose = require('mongoose')

const reportSchema = new mongoose.Schema({
    name:String,
    email:String,
    lastLogin:{
        type:Date
    },
    user:String
})

const ReportModel = mongoose.model('report', reportSchema);

module.exports = ReportModel