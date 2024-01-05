const { httpStatus } = require('../constants/constants');
const ReportModel = require('../model/history');
const httpMsg = httpStatus();

const lastLogin = async(req,res)=>{
    try {
        const data = await ReportModel.find({}).sort({ lastLogin: 'desc' })
        res.json(data)
    } catch (error) {
        res.status(500).json({ message: httpMsg[500], error: error });
    }
}

module.exports = {
    lastLogin
}