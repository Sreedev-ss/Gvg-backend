const mongoose = require('mongoose')

const plantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    }
})

const PlantModal = mongoose.model('plant', plantSchema)

module.exports = PlantModal