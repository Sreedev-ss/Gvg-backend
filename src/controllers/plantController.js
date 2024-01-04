const { httpStatus } = require('../constants/constants');
const PlantModal = require('../model/plant');
const httpMsg = httpStatus()

const allPlant = async (req, res) => {
    try {
        const plants = await PlantModal.find({})
        res.json(plants)
    } catch (error) {
        res.status(500).json({ message: httpMsg[500], error: error });
    }
}

const createPlant = async (req, res) => {
    try {
        const { name, description } = req.body

        const plant = new PlantModal({
            name: name,
            description: description
        })

        await plant.save()
        res.json({ message: 'Plant successfully created' })
    } catch (error) {
        res.status(500).json({ message: httpMsg[500], error: error });
    }
}

module.exports = {
    allPlant,
    createPlant
}