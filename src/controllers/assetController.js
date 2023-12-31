const Asset = require("../model/asset");
const { httpStatus } = require('../constants/constants');
const { default: mongoose } = require("mongoose");
const httpMsg = httpStatus()


const getData = async (req, res) => {
    try {
        const parentId = req.params.parentId === 'null' ? null : req.params.parentId;
        const plantId = req.params.plantId
        const children = await Asset.find({ parent: parentId, plant: plantId });
        res.json(children);
    } catch (error) {
        res.status(500).json({ message: httpMsg[500], error: error });
    }
}

const fetchChildren = async (parentId, plant) => {
    const children = await Asset.find({ parent: parentId, plant: plant }).select('-__v');
    const childrenWithHierarchy = [];

    for (const child of children) {
        const childData = {
            _id: child._id,
            name: child.name,
            description: child.description,
            parent: parentId,  // Correctly assign the parent ID
            system: child.system,
            plant: child.plant,
            level: child.level,
            children: await fetchChildren(child._id, child.plant), // Recursively fetch children
        };

        childrenWithHierarchy.push(childData);
    }

    return childrenWithHierarchy;
};

const drillData = async (req, res) => {
    try {
        const plantId = req.params.plantId
        // Find top-level assets
        const topAssets = await Asset.find({ parent: null, plant: plantId }).select('-__v');
        const dataWithHierarchy = [];

        // Iterate over top-level assets
        for (const topAsset of topAssets) {
            const topLevelData = {
                _id: topAsset._id,
                name: topAsset.name,
                description: topAsset.description,
                parent: null,  // Top-level asset's parent should be null
                system: topAsset.system,
                plant: topAsset.plant,
                level: topAsset.level,
                children: await fetchChildren(topAsset._id, topAsset.plant), // Recursively fetch children
            };

            dataWithHierarchy.push(topLevelData);
        }

        res.json(dataWithHierarchy);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const drillDatabyParent = async (req, res) => {
    try {
        const id = req.params?.parentId
        const plantId = req.params.plantId
        // Find top-level assets
        const topAssets = await Asset.find({ _id: id, plant: plantId }).select('-__v');
        const dataWithHierarchy = [];

        // Iterate over top-level assets
        for (const topAsset of topAssets) {
            const topLevelData = {
                _id: topAsset._id,
                name: topAsset.name,
                description: topAsset.description,
                parent: null,  // Top-level asset's parent should be null
                system: topAsset.system,
                plant: topAsset.plant,
                level: topAsset.level,
                children: await fetchChildren(topAsset._id, topAsset.plant), // Recursively fetch children
            };

            dataWithHierarchy.push(topLevelData);
        }

        res.json(dataWithHierarchy);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const allData = async (req, res) => {
    try {
        const plantId = req.params.plantId
        const data = await Asset.find({ plant: plantId })
        res.json(data)
    } catch (error) {
        res.status(500).json({ message: httpMsg[500], error: error });
    }
}

const getAssetById = async (req, res) => {
    try {
        const assetId = req.params.assetId;
        const plantId = req.params.plantId
        const asset = await Asset.findOne({ name: assetId, plant: plantId });

        if (asset) {
            res.json(asset);
        } else {
            res.status(404).json({ message: 'Asset not found' });
        }
    } catch (error) {
        console.error('Error retrieving asset:', error);
        res.status(500).json({ message: httpMsg[500], error: error });
    }
}

const addDataByLevel = async (req, res) => {
    try {
        const { name, description, parent, system, plant, color } = req.body;
        const level = parseInt(req.params.level);

        const newAsset = await Asset.create({ name, description, parent, system, level, plant, color });
        res.json(newAsset);
    } catch (error) {
        console.error('Error creating asset:', error);
        res.status(500).json({ message: httpMsg[500], error: error });
    }
}

const addData = async (req, res) => {
    try {
        const doc = req.body;
        const filteredData = doc.filter(doc => doc.name !== null);
        const newAsset = await Asset.insertMany(filteredData);
        res.json(newAsset);
    } catch (error) {
        console.error('Error creating asset:', error);
        res.status(500).json({ message: httpMsg[500], error: error });
    }
}

const editData = async (req, res) => {
    try {
        const assetId = req.params.assetId;
        const { name, description, system } = req.body;

        const updatedAsset = await Asset.findByIdAndUpdate(
            assetId,
            { name, description, system },
            { new: true }
        );
        res.json(updatedAsset);
    } catch (error) {
        res.status(500).json({ message: httpMsg[500], error: error });
    }
}

const deleteAssetAndChildren = async (assetId, name) => {

}

const deleteAsset = async (req, res) => {
    try {
        const assetId = req.params.assetId;
        const name = req.params.name
        const plant = req.params.plantId
        // Delete the asset and its children
        // await deleteAssetAndChildren(assetId, name);
        await Asset.findByIdAndDelete(assetId)
        await Asset.deleteMany({ parent: name, plant: plant })

        res.json({ message: 'Asset and its children deleted successfully' });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: httpMsg[500], error: error });
    }
}

const duplicateAssetAndChildren = async (originalAssetName, newParentName, plant) => {
    const originalAsset = await Asset.findOne({ name: originalAssetName, plant: plant });

    const newAssetId = new mongoose.Types.ObjectId();

    const duplicatedAsset = new Asset({
        _id: newAssetId,
        name: `Copy of ${originalAsset.name}`,
        description: originalAsset.description,
        parent: newParentName, // Use the name of the new parent
        system: originalAsset.system,
        level: originalAsset.level,
        plant: originalAsset.plant,
        color: originalAsset.color,
        children: [], // Updated in the recursive call
    });

    await duplicatedAsset.save();

    // Fetch and duplicate children based on parent-child relationship
    const children = await Asset.find({ parent: originalAssetName,plant:plant });
    for (const child of children) {
        const newChildId = await duplicateAssetAndChildren(child.name, duplicatedAsset.name,duplicatedAsset.plant);
        duplicatedAsset.children.push(newChildId);
    }

    // Update the duplicated asset with the new children
    await duplicatedAsset.save();

    return newAssetId;
}

const duplicateAsset = async (req, res) => {
    try {
        const originalAssetId = req.params.originalAssetId;

        if (!mongoose.Types.ObjectId.isValid(originalAssetId)) {
            return res.status(400).json({ message: 'Invalid ObjectId format' });
        }

        const originalAsset = await Asset.findById(originalAssetId);
        const newAssetId = await duplicateAssetAndChildren(originalAsset.name, originalAsset.parent, originalAsset.plant);

        if (newAssetId) {
            res.json({ message: 'Asset and its children duplicated successfully', newAssetId });
        } else {
            res.status(404).json({ message: 'Asset not found' });
        }
    } catch (error) {
        console.error('Error duplicating asset:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const updateColor = async (req, res) => {
    try {
        const plantId = req.params.plantId
        const level = req.params.level
        const color = req.body.color
        const updatedColor = await Asset.updateMany({ plant: plantId, level: level }, {
            $set: {
                color: color
            }
        })

        res.json(updatedColor)

    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
const updateBgColor = async (req, res) => {
    try {
        const plantId = req.params.plantId
        const level = req.params.level
        const color = req.body.color
        const updatedColor = await Asset.updateMany({ plant: plantId, level: level }, {
            $set: {
                bgcolor: color
            }
        })

        res.json(updatedColor)

    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}


module.exports = {
    getData,
    allData,
    getAssetById,
    drillData,
    addDataByLevel,
    addData,
    editData,
    deleteAsset,
    duplicateAsset,
    drillDatabyParent,
    updateColor,
    updateBgColor
}