const { default: mongoose } = require('mongoose');
const { httpStatus } = require('../constants/constants');
const Asset = require('../model/asset');
const PlantModal = require('../model/plant');
const httpMsg = httpStatus()
const _ = require('lodash');

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

const clonePlant = async (req, res) => {
    try {
        const originalPlantId = req.params.id;
        const originalPlant = await PlantModal.findById(originalPlantId);

        if (!originalPlant) {
            return res.status(404).json({ message: 'Original plant not found' });
        }

        const clonedPlant = {};

        clonedPlant.name = `Copy of ${originalPlant.name}`;
        clonedPlant.description = `Copy of ${originalPlant.description}`;

        const savedClonedPlant = new PlantModal({
            name: clonedPlant.name,
            description: clonedPlant.description
        });
        const data = await savedClonedPlant.save()
        const originalAssets = await Asset.find({ plant: originalPlant._id });

        const clonedAssets = await cloneAssetsAndUpdatePlant(originalAssets, data._id);

        const savedClonedAssets = await Asset.insertMany(clonedAssets);

        res.json({ plant: savedClonedPlant, assets: savedClonedAssets });
    } catch (error) {
        console.error('Error cloning plant and assets:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const cloneAssetsAndUpdatePlant = (assets, newPlantId) => {
    return assets.map(originalAsset => {
        const clonedAsset = _.cloneDeep(originalAsset);
        const newAssetId = new mongoose.Types.ObjectId();

        clonedAsset._id = newAssetId;
        clonedAsset.plant = newPlantId;

        return clonedAsset;
    });
};


module.exports = {
    allPlant,
    createPlant,
    deletePlant,
    updatePlant,
    clonePlant
}