const express = require('express')
const { addData, getData, allData, drillData, addDataByLevel, editData, deleteAsset } = require('../controllers/assetController')

const app = express.Router()

app.get('/children/:parentId', getData)
app.get('/drill-allAsset', drillData)
app.get('/allAsset', allData)
app.post('/addAsset/:level', addDataByLevel)
app.put('/editAsset/:assetId', editData)
app.delete('/deleteAsset/:assetId', deleteAsset)
module.exports = app