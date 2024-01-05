const { httpStatus } = require('../constants/constants');
const Asset = require('../model/asset');
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
        res.json({ message: 'Plant successfully created', plant })
    } catch (error) {
        res.status(500).json({ message: httpMsg[500], error: error });
    }
}

const updatePlant = async (req, res) => {
    try {
        const id = req.params.id
        const { name, description } = req.body;
        console.log(name, description)
        const updatedPlant = await PlantModal.findByIdAndUpdate(
            id,
            { name, description },
            { new: true }
        )
        res.json(updatedPlant)

    } catch (error) {
        res.status(500).json({ message: httpMsg[500], error: error });
    }
}

const deletePlant = async (req, res) => {
    try {
        const id = req.params.id
        const response = await PlantModal.findByIdAndDelete(id)
        await Asset.deleteMany({ plant: id })
        res.json({ message: 'Plant deleted successfully', response })
    } catch (error) {
        res.status(500).json({ message: httpMsg[500], error: error });
    }
}

module.exports = {
    allPlant,
    createPlant,
    deletePlant,
    updatePlant
}