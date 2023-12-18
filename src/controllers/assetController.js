const Asset = require("../model/asset");
const { httpStatus } = require('../constants/constants');
const httpMsg = httpStatus()


const getData = async (req, res) => {
    try {
        const parentId = req.params.parentId === 'null' ? null : req.params.parentId;
        const children = await Asset.find({ parent: parentId });
        res.json(children);
    } catch (error) {
        res.status(500).json({ message: httpMsg[500], error: error });
    }
}

const fetchChildren = async (parentId) => {
    const children = await Asset.find({ parent: parentId }).select('-__v');
    const childrenWithHierarchy = [];

    for (const child of children) {
        const childData = {
            _id: child._id,
            name: child.name,
            description: child.description,
            parent: parentId,  // Correctly assign the parent ID
            system: child.system,
            level: child.level,
            children: await fetchChildren(child._id), // Recursively fetch children
        };

        childrenWithHierarchy.push(childData);
    }

    return childrenWithHierarchy;
};

const drillData = async (req, res) => {
    try {
        // Find top-level assets
        const topAssets = await Asset.find({ parent: null }).select('-__v');
        const dataWithHierarchy = [];

        // Iterate over top-level assets
        for (const topAsset of topAssets) {
            const topLevelData = {
                _id: topAsset._id,
                name: topAsset.name,
                description: topAsset.description,
                parent: null,  // Top-level asset's parent should be null
                system: topAsset.system,
                level: topAsset.level,
                children: await fetchChildren(topAsset._id), // Recursively fetch children
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
        const data = await Asset.find()
        res.json(data)
    } catch (error) {
        res.status(500).json({ message: httpMsg[500], error: error });
    }
}

const addDataByLevel = async (req, res) => {
    try {
        const { name, description, parent, system } = req.body;
        const level = parseInt(req.params.level);

        const newAsset = await Asset.create({ name, description, parent, system, level });
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

const deleteAssetAndChildren = async (assetId) => {
    const asset = await Asset.findById(assetId);
    if (!asset) {
        return;
    }
    if (asset.children && Array.isArray(asset.children)) {
        for (const childId of asset.children) {
            await deleteAssetAndChildren(childId);
        }
    }
    await Asset.findByIdAndDelete(assetId);
}

const deleteAsset = async (req, res) => {
    try {
        const assetId = req.params.assetId;

        // Delete the asset and its children
        await deleteAssetAndChildren(assetId);

        res.json({ message: 'Asset and its children deleted successfully' });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: httpMsg[500], error: error });
    }
}


module.exports = {
    getData,
    allData,
    drillData,
    addDataByLevel,
    editData,
    deleteAsset
}