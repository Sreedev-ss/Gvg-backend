const Asset = require("../model/asset");
const { httpStatus } = require('../constants/constants');
const httpMsg = httpStatus()

const data = [
    { name: 'EAST ASSETS', description: 'Top level asset', parent: null, system: 'primary', level: 0 },
    { name: 'A', description: 'A region', parent: 'EAST ASSETS', system: 'primary', level: 1 },
    { name: 'F', description: 'F region', parent: 'EAST ASSETS', system: 'primary', level: 1 },
    { name: 'S', description: 'S region', parent: 'EAST ASSETS', system: 'primary', level: 1 },
    { name: 'S-ADMIN', description: 'S Administration', parent: 'S', system: 'primary', level: 2 },
    { name: 'S-FIELD', description: 'S Fields', parent: 'S', system: 'primary', level: 2 },
    { name: 'S-PLANT', description: 'S Facilities', parent: 'S', system: 'primary', level: 2 },
    { name: 'S-PLANT-SAT', description: 'S Satellite; S', parent: 'S-PLANT', system: 'primary', level: 3 },
    { name: 'S-PLANT-SAT-BLD', description: 'Buildings; S Satellite; S', parent: 'S-PLANT', system: 'primary', level: 4 },
    { name: 'S-PLANT-SAT-CMS', description: 'Communications; S Satellite; S', parent: 'S-PLANT', system: 'primary', level: 4 },
    { name: 'S-PLANT-SAT-COM', description: 'Compression; S Satellite; S', parent: 'S-PLANT', system: 'primary', level: 4 },
];

const addData = async (req, res) => {
    try {
        // for (const item of data) {
        //     const parentAsset = await Asset.findOne({ name: item.parent });
        //     if (parentAsset) {
        //         item.parent = parentAsset._id;
        //     }

        //     await Asset.create(item);
        // }
        res.json('Data inserted successfully.')
    } catch (error) {
        res.status(500).json({ message: httpMsg[500], error: error });
    }
}

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


module.exports = {
    addData,
    getData,
    allData,
    drillData
}