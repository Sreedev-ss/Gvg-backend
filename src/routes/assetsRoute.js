const express = require('express')
const { addData, getData, allData, drillData, addDataByLevel, editData, deleteAsset, getAssetById, duplicateAsset, drillDatabyParent, updateColor, updateBgColor } = require('../controllers/assetController')
const Asset = require('../model/asset')

const app = express.Router()

app.get('/children/:parentId/:plantId', getData)
app.get('/asset/:assetId/:plantId', getAssetById)

app.get('/drill-allAsset/:plantId', drillData)
app.get('/drill-asset/:parentId/:plantId', drillDatabyParent)

app.get('/allAsset/:plantId', allData)
app.post('/addAsset/:level', addDataByLevel)
app.post('/addAssetImport', addData)
app.put('/editAsset/:assetId', editData)
app.delete('/deleteAsset/:assetId/:name/:plantId', deleteAsset)

app.delete('/delete-dummy-assetData', async (req, res) => {
    const fieldName = "name";
    const data = await Asset.deleteMany({
        [fieldName]: { $exists: false }
    });
    console.log(data)
    res.json(data)
})
app.put('/update-color/:level/:plantId', updateColor)
app.put('/update-bg-color/:level/:plantId',updateBgColor)

// app.put('/add-color/:plantId', async(req, res) => {
//     const color = "#3773ca"
//     const plantId = req.params.plantId
//     const data = await Asset.updateMany({plant:plantId},{
//         $set:{
//             color:color
//         }
//     })
//     res.json(data)
// })

// app.put('/add-bg-color', async(req, res) => {
//     const color = "#d7ebe6"
//     const plantId = req.params.plantId
//     const data = await Asset.updateMany({},{
//         $set:{
//             bgcolor:color
//         }
//     })
//     res.json(data)
// })

app.post('/duplicate/:originalAssetId', duplicateAsset)
app.get('/', (req, res) => {
    res.send("Server is running")
})
module.exports = app