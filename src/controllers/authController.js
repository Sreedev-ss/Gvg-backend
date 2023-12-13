const { httpStatus } = require('./src/constants/constants')
const httpMsg = httpStatus()

const sample = (req, res) => {
    try {
        res.json('Hi')
    } catch (error) {
        res.status(500).json({ error: httpMsg[500], errorMessage: error });
    }
}

module.exports = {
    sample
}